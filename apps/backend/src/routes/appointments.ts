import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AppointmentService } from '../services/AppointmentService.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const createAppointmentSchema = z.object({
  patientId: z.string(),
  doctorId: z.string(),
  scheduledTime: z.string().transform((val) => new Date(val)),
  notes: z.string().optional(),
});

const updateAppointmentSchema = z.object({
  status: z.enum(['SCHEDULED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW']).optional(),
  notes: z.string().optional(),
});

const checkInSchema = z.object({
  appointmentId: z.string(),
});

export async function appointmentRoutes(fastify: FastifyInstance) {
  const appointmentService = new AppointmentService(fastify.prisma);

  // Create appointment (Patient or Reception)
  fastify.post('/', {
    preHandler: [authenticate, requireRole('PATIENT', 'RECEPTION', 'ADMIN')],
  }, async (request, reply) => {
    const body = createAppointmentSchema.parse(request.body);

    const appointment = await appointmentService.createAppointment({
      patientId: body.patientId,
      doctorId: body.doctorId,
      scheduledTime: body.scheduledTime,
      notes: body.notes,
    });

    return reply.code(201).send(appointment);
  });

  // Get patient's appointments
  fastify.get('/my-appointments', {
    preHandler: [authenticate, requireRole('PATIENT')],
  }, async (request, reply) => {
    const userId = request.user!.userId;

    const appointments = await appointmentService.getPatientAppointments(userId);

    return reply.send(appointments);
  });

  // Get doctor's queue
  fastify.get('/doctor-queue', {
    preHandler: [authenticate, requireRole('DOCTOR')],
  }, async (request, reply) => {
    const doctorId = request.user!.userId;
    const date = new Date(); // Today's queue

    const queue = await appointmentService.getDoctorQueue(doctorId, date);

    return reply.send(queue);
  });

  // Get specific appointment
  fastify.get('/:id', {
    preHandler: [authenticate],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const appointment = await appointmentService.getAppointmentById(id);

    return reply.send(appointment);
  });

  // Check-in appointment
  fastify.post('/check-in', {
    preHandler: [authenticate, requireRole('PATIENT', 'RECEPTION')],
  }, async (request, reply) => {
    const body = checkInSchema.parse(request.body);

    const appointment = await appointmentService.checkIn(body.appointmentId);

    return reply.send(appointment);
  });

  // Update appointment status (Doctor or Reception)
  fastify.patch('/:id', {
    preHandler: [authenticate, requireRole('DOCTOR', 'RECEPTION', 'ADMIN')],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateAppointmentSchema.parse(request.body);

    const appointment = await appointmentService.updateAppointmentStatus(id, body);

    return reply.send(appointment);
  });

  // Cancel appointment
  fastify.delete('/:id', {
    preHandler: [authenticate],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };

    const appointment = await appointmentService.updateAppointmentStatus(id, {
      status: 'CANCELLED',
    });

    return reply.send(appointment);
  });
}
