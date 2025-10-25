import { PrismaClient } from '@prisma/client';
import { BaseService } from './BaseService.js';
import { APIError } from '../utils/APIError.js';

export interface CreateHospitalInput {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  operatingHours: any; // JSON
  emergencyContact: string;
}

export interface UpdateHospitalInput extends Partial<CreateHospitalInput> {
  logoUrl?: string;
}

export interface CreateDepartmentInput {
  hospitalId: string;
  name: string;
  description?: string;
  building: string;
  floor: number;
  wing?: string;
  headDoctorId?: string;
  phone?: string;
  email?: string;
  operatingHours?: any; // JSON
  services: string[];
}

export interface UpdateDepartmentInput extends Partial<CreateDepartmentInput> {
  isActive?: boolean;
}

export interface CreateHolidayInput {
  hospitalId: string;
  name: string;
  date: Date;
  isRecurring: boolean;
}

export class HospitalService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  /**
   * Create hospital profile
   */
  async createHospital(input: CreateHospitalInput) {
    // Check if hospital already exists
    const existing = await this.prisma.hospital.findFirst();

    if (existing) {
      throw new APIError('Hospital profile already exists', 400, 'HOSPITAL_EXISTS');
    }

    const hospital = await this.prisma.hospital.create({
      data: {
        name: input.name,
        address: input.address,
        city: input.city,
        state: input.state,
        zip_code: input.zipCode,
        country: input.country,
        phone: input.phone,
        email: input.email,
        website: input.website,
        description: input.description,
        operating_hours: input.operatingHours,
        emergency_contact: input.emergencyContact,
      },
    });

    return hospital;
  }

  /**
   * Update hospital profile
   */
  async updateHospital(id: string, input: UpdateHospitalInput) {
    const hospital = await this.prisma.hospital.findUnique({
      where: { id },
    });

    if (!hospital) {
      throw new APIError('Hospital not found', 404, 'HOSPITAL_NOT_FOUND');
    }

    const updated = await this.prisma.hospital.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.address && { address: input.address }),
        ...(input.city && { city: input.city }),
        ...(input.state && { state: input.state }),
        ...(input.zipCode && { zip_code: input.zipCode }),
        ...(input.country && { country: input.country }),
        ...(input.phone && { phone: input.phone }),
        ...(input.email && { email: input.email }),
        ...(input.website !== undefined && { website: input.website }),
        ...(input.logoUrl !== undefined && { logo_url: input.logoUrl }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.operatingHours && { operating_hours: input.operatingHours }),
        ...(input.emergencyContact && { emergency_contact: input.emergencyContact }),
      },
    });

    return updated;
  }

  /**
   * Get hospital profile
   */
  async getHospital() {
    const hospital = await this.prisma.hospital.findFirst({
      include: {
        departments: {
          where: { is_active: true },
          orderBy: { name: 'asc' },
        },
        holidays: {
          where: {
            date: {
              gte: new Date(),
            },
          },
          orderBy: { date: 'asc' },
        },
      },
    });

    if (!hospital) {
      throw new APIError('Hospital not found', 404, 'HOSPITAL_NOT_FOUND');
    }

    return hospital;
  }

  /**
   * Create department
   */
  async createDepartment(input: CreateDepartmentInput) {
    // Verify hospital exists
    const hospital = await this.prisma.hospital.findUnique({
      where: { id: input.hospitalId },
    });

    if (!hospital) {
      throw new APIError('Hospital not found', 404, 'HOSPITAL_NOT_FOUND');
    }

    // Verify head doctor exists if provided
    if (input.headDoctorId) {
      const doctor = await this.prisma.user.findUnique({
        where: { id: input.headDoctorId },
      });

      if (!doctor || doctor.role !== 'DOCTOR') {
        throw new APIError('Invalid head doctor', 400, 'INVALID_HEAD_DOCTOR');
      }
    }

    const department = await this.prisma.department.create({
      data: {
        hospital_id: input.hospitalId,
        name: input.name,
        description: input.description,
        building: input.building,
        floor: input.floor,
        wing: input.wing,
        head_doctor_id: input.headDoctorId,
        phone: input.phone,
        email: input.email,
        operating_hours: input.operatingHours,
        services: input.services,
      },
    });

    return department;
  }

  /**
   * Update department
   */
  async updateDepartment(id: string, input: UpdateDepartmentInput) {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new APIError('Department not found', 404, 'DEPARTMENT_NOT_FOUND');
    }

    const updated = await this.prisma.department.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.building && { building: input.building }),
        ...(input.floor !== undefined && { floor: input.floor }),
        ...(input.wing !== undefined && { wing: input.wing }),
        ...(input.headDoctorId !== undefined && { head_doctor_id: input.headDoctorId }),
        ...(input.phone !== undefined && { phone: input.phone }),
        ...(input.email !== undefined && { email: input.email }),
        ...(input.operatingHours && { operating_hours: input.operatingHours }),
        ...(input.services && { services: input.services }),
        ...(input.isActive !== undefined && { is_active: input.isActive }),
      },
    });

    return updated;
  }

  /**
   * Delete department (soft delete)
   */
  async deleteDepartment(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
    });

    if (!department) {
      throw new APIError('Department not found', 404, 'DEPARTMENT_NOT_FOUND');
    }

    await this.prisma.department.update({
      where: { id },
      data: { is_active: false },
    });

    return { success: true, message: 'Department deactivated successfully' };
  }

  /**
   * Get department by ID
   */
  async getDepartment(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      include: {
        hospital: true,
        doctors: {
          include: {
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
        staff: {
          include: {
            user: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                phone: true,
              },
            },
          },
        },
      },
    });

    if (!department) {
      throw new APIError('Department not found', 404, 'DEPARTMENT_NOT_FOUND');
    }

    return department;
  }

  /**
   * List all departments
   */
  async listDepartments(filters?: { hospitalId?: string; isActive?: boolean }) {
    const where: any = {};

    if (filters?.hospitalId) {
      where.hospital_id = filters.hospitalId;
    }

    if (filters?.isActive !== undefined) {
      where.is_active = filters.isActive;
    }

    const departments = await this.prisma.department.findMany({
      where,
      orderBy: { name: 'asc' },
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return {
      departments,
      total: departments.length,
    };
  }

  /**
   * Create holiday
   */
  async createHoliday(input: CreateHolidayInput) {
    const holiday = await this.prisma.holiday.create({
      data: {
        hospital_id: input.hospitalId,
        name: input.name,
        date: input.date,
        is_recurring: input.isRecurring,
      },
    });

    return holiday;
  }

  /**
   * Delete holiday
   */
  async deleteHoliday(id: string) {
    await this.prisma.holiday.delete({
      where: { id },
    });

    return { success: true, message: 'Holiday deleted successfully' };
  }

  /**
   * List holidays
   */
  async listHolidays(hospitalId: string, year?: number) {
    const where: any = {
      hospital_id: hospitalId,
    };

    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);
      where.date = {
        gte: startDate,
        lte: endDate,
      };
    }

    const holidays = await this.prisma.holiday.findMany({
      where,
      orderBy: { date: 'asc' },
    });

    return holidays;
  }
}

