import { PrismaClient } from '@prisma/client';
import { APIError } from '../utils/APIError.js';
import { BaseService } from './BaseService.js';

export interface SearchDoctorsInput {
  department?: string;
  specialization?: string;
  name?: string;
  limit?: number;
  offset?: number;
}

export interface UpdateDoctorProfileInput {
  specialization?: string;
  department?: string;
  consultationFee?: number;
  availability?: any;
}

export class DoctorService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async searchDoctors(input: SearchDoctorsInput) {
    const { department, specialization, name, limit = 20, offset = 0 } = input;

    const where: any = {
      role: 'DOCTOR',
    };

    if (name) {
      where.OR = [
        { first_name: { contains: name, mode: 'insensitive' } },
        { last_name: { contains: name, mode: 'insensitive' } },
      ];
    }

    const doctors = await this.prisma.user.findMany({
      where,
      include: {
        doctor_profile: true,
      },
      take: limit,
      skip: offset,
    });

    // Filter by department or specialization if provided
    let filteredDoctors = doctors;
    if (department || specialization) {
      filteredDoctors = doctors.filter((doctor) => {
        if (!doctor.doctor_profile) return false;
        if (department && doctor.doctor_profile.department !== department) return false;
        if (specialization && doctor.doctor_profile.specialization !== specialization) return false;
        return true;
      });
    }

    return filteredDoctors.map((doctor) => ({
      id: doctor.id,
      firstName: doctor.first_name,
      lastName: doctor.last_name,
      email: doctor.email,
      phone: doctor.phone,
      specialization: doctor.doctor_profile?.specialization,
      department: doctor.doctor_profile?.department,
      consultationFee: doctor.doctor_profile?.consultation_fee,
      availability: doctor.doctor_profile?.availability,
    }));
  }

  async getDoctorById(doctorId: string) {
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId, role: 'DOCTOR' },
      include: {
        doctor_profile: true,
      },
    });

    if (!doctor) {
      throw new APIError('Doctor not found', 404, 'DOCTOR_NOT_FOUND');
    }

    return {
      id: doctor.id,
      firstName: doctor.first_name,
      lastName: doctor.last_name,
      email: doctor.email,
      phone: doctor.phone,
      specialization: doctor.doctor_profile?.specialization,
      department: doctor.doctor_profile?.department,
      consultationFee: doctor.doctor_profile?.consultation_fee,
      availability: doctor.doctor_profile?.availability,
    };
  }

  async updateDoctorProfile(doctorId: string, input: UpdateDoctorProfileInput) {
    // Verify doctor exists
    const doctor = await this.prisma.user.findUnique({
      where: { id: doctorId, role: 'DOCTOR' },
      include: { doctor_profile: true },
    });

    if (!doctor) {
      throw new APIError('Doctor not found', 404, 'DOCTOR_NOT_FOUND');
    }

    // Update or create doctor profile
    const profile = await this.prisma.doctorProfile.upsert({
      where: { user_id: doctorId },
      create: {
        user_id: doctorId,
        specialization: input.specialization || 'General',
        department: input.department || 'General',
        consultation_fee: input.consultationFee || 0,
        availability: input.availability || {},
      },
      update: {
        ...(input.specialization && { specialization: input.specialization }),
        ...(input.department && { department: input.department }),
        ...(input.consultationFee !== undefined && { consultation_fee: input.consultationFee }),
        ...(input.availability && { availability: input.availability }),
      },
    });

    return profile;
  }

  async getDoctorSchedule(doctorId: string, date: Date) {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        doctor_id: doctorId,
        scheduled_time: {
          gte: startOfDay,
          lte: endOfDay,
        },
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
      orderBy: {
        scheduled_time: 'asc',
      },
    });

    return appointments;
  }

  async getDepartments() {
    const doctors = await this.prisma.doctorProfile.findMany({
      select: {
        department: true,
      },
      distinct: ['department'],
    });

    return doctors.map((d) => d.department);
  }

  async getSpecializations() {
    const doctors = await this.prisma.doctorProfile.findMany({
      select: {
        specialization: true,
      },
      distinct: ['specialization'],
    });

    return doctors.map((d) => d.specialization);
  }
}

