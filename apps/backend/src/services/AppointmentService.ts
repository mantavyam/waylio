import { PrismaClient, AppointmentStatus } from '@prisma/client';
import { APIError } from '../utils/APIError.js';
import { BaseService } from './BaseService.js';
import { queue } from '../config/redis.js';
import { socketEvents } from '../config/socket.js';

export interface CreateAppointmentInput {
  patientId: string;
  doctorId: string;
  scheduledTime: Date;
  notes?: string;
}

export interface UpdateAppointmentInput {
  status?: AppointmentStatus;
  notes?: string;
  checkInTime?: Date;
  consultationStartTime?: Date;
  consultationEndTime?: Date;
}

export class AppointmentService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  private getQueueKey(doctorId: string, date: Date): string {
    const dateStr = date.toISOString().split('T')[0];
    return `queue:doctor:${doctorId}:${dateStr}`;
  }

  async createAppointment(input: CreateAppointmentInput) {
    // Verify doctor exists
    const doctor = await this.prisma.user.findUnique({
      where: { id: input.doctorId, role: 'DOCTOR' },
    });

    if (!doctor) {
      throw new APIError('Doctor not found', 404, 'DOCTOR_NOT_FOUND');
    }

    // Verify patient exists
    const patient = await this.prisma.user.findUnique({
      where: { id: input.patientId },
    });

    if (!patient) {
      throw new APIError('Patient not found', 404, 'PATIENT_NOT_FOUND');
    }

    // Check for conflicting appointments
    const existingAppointment = await this.prisma.appointment.findFirst({
      where: {
        doctor_id: input.doctorId,
        scheduled_time: input.scheduledTime,
        status: {
          notIn: ['CANCELLED', 'COMPLETED', 'NO_SHOW'],
        },
      },
    });

    if (existingAppointment) {
      throw new APIError(
        'This time slot is already booked',
        400,
        'SLOT_UNAVAILABLE'
      );
    }

    // Create appointment
    const appointment = await this.prisma.appointment.create({
      data: {
        patient_id: input.patientId,
        doctor_id: input.doctorId,
        scheduled_time: input.scheduledTime,
        notes: input.notes,
        status: 'SCHEDULED',
      },
      include: {
        patient: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            doctor_profile: true,
          },
        },
      },
    });

    // Emit notification to patient
    socketEvents.emitAppointmentStatusChange(input.patientId, {
      appointmentId: appointment.id,
      status: 'SCHEDULED',
      scheduledTime: appointment.scheduled_time,
    });

    return appointment;
  }

  async checkIn(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: true,
      },
    });

    if (!appointment) {
      throw new APIError('Appointment not found', 404, 'APPOINTMENT_NOT_FOUND');
    }

    if (appointment.status !== 'SCHEDULED') {
      throw new APIError(
        'Only scheduled appointments can be checked in',
        400,
        'INVALID_STATUS'
      );
    }

    // Update appointment status
    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: 'CHECKED_IN',
        check_in_time: new Date(),
      },
      include: {
        patient: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // Add to queue
    const queueKey = this.getQueueKey(
      appointment.doctor_id,
      appointment.scheduled_time
    );
    const queueLength = await queue.getQueueLength(queueKey);
    await queue.addToQueue(queueKey, appointmentId, queueLength);

    // Update queue position
    const position = await queue.getQueuePosition(queueKey, appointmentId);
    await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: { queue_position: position },
    });

    // Emit queue update to doctor
    await this.emitQueueUpdate(appointment.doctor_id, appointment.scheduled_time);

    // Emit position update to patient
    socketEvents.emitPatientQueuePosition(
      appointment.patient_id,
      position || 0,
      (position || 0) * 15 // Estimate 15 min per patient
    );

    return updatedAppointment;
  }

  async updateAppointmentStatus(appointmentId: string, input: UpdateAppointmentInput) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw new APIError('Appointment not found', 404, 'APPOINTMENT_NOT_FOUND');
    }

    const updatedAppointment = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        ...(input.status && { status: input.status }),
        ...(input.notes && { notes: input.notes }),
        ...(input.checkInTime && { check_in_time: input.checkInTime }),
        ...(input.consultationStartTime && {
          consultation_start_time: input.consultationStartTime,
        }),
        ...(input.consultationEndTime && {
          consultation_end_time: input.consultationEndTime,
        }),
      },
      include: {
        patient: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    // If status changed to IN_PROGRESS or COMPLETED, update queue
    if (input.status === 'IN_PROGRESS') {
      const queueKey = this.getQueueKey(
        appointment.doctor_id,
        appointment.scheduled_time
      );
      await queue.removeFromQueue(queueKey, appointmentId);
      await this.emitQueueUpdate(appointment.doctor_id, appointment.scheduled_time);
    }

    if (input.status === 'COMPLETED' || input.status === 'CANCELLED') {
      const queueKey = this.getQueueKey(
        appointment.doctor_id,
        appointment.scheduled_time
      );
      await queue.removeFromQueue(queueKey, appointmentId);
      await this.emitQueueUpdate(appointment.doctor_id, appointment.scheduled_time);
    }

    // Emit status change to patient
    socketEvents.emitAppointmentStatusChange(appointment.patient_id, {
      appointmentId: appointment.id,
      status: input.status,
    });

    return updatedAppointment;
  }

  async getDoctorQueue(doctorId: string, date: Date) {
    const queueKey = this.getQueueKey(doctorId, date);
    const appointmentIds = await queue.getQueue(queueKey);

    if (appointmentIds.length === 0) {
      return [];
    }

    const appointments = await this.prisma.appointment.findMany({
      where: {
        id: { in: appointmentIds },
      },
      include: {
        patient: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            patient_profile: true,
          },
        },
      },
    });

    // Sort by queue position
    const sortedAppointments = appointmentIds
      .map((id) => appointments.find((a) => a.id === id))
      .filter((a) => a !== undefined);

    return sortedAppointments;
  }

  async getPatientAppointments(patientId: string) {
    const appointments = await this.prisma.appointment.findMany({
      where: { patient_id: patientId },
      include: {
        doctor: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            doctor_profile: true,
          },
        },
      },
      orderBy: {
        scheduled_time: 'desc',
      },
    });

    return appointments;
  }

  async getAppointmentById(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        patient: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            patient_profile: true,
          },
        },
        doctor: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
            doctor_profile: true,
          },
        },
      },
    });

    if (!appointment) {
      throw new APIError('Appointment not found', 404, 'APPOINTMENT_NOT_FOUND');
    }

    return appointment;
  }

  private async emitQueueUpdate(doctorId: string, date: Date) {
    const queueData = await this.getDoctorQueue(doctorId, date);
    socketEvents.emitQueueUpdate(doctorId, queueData);
  }
}

