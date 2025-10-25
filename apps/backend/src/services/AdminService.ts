import { PrismaClient, UserRole, StaffRole } from '@prisma/client';
import { BaseService } from './BaseService.js';
import { APIError } from '../utils/APIError.js';
import { passwordUtils } from '../utils/password.js';
import { uniqueIdUtils } from '../utils/uniqueId.js';
import { NotificationService } from './NotificationService.js';

export interface CreateDoctorInput {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  specialization: string;
  departmentId: string;
  registrationNumber: string;
  qualifications: string[];
  experience: number;
  consultationFee: number;
  followUpFee?: number;
  videoConsultationFee?: number;
  languages: string[];
  bio?: string;
}

export interface CreateStaffInput {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  staffRole: StaffRole;
  departmentId?: string;
  employeeId?: string;
  joiningDate: Date;
}

export interface UpdateUserInput {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

export interface UserListFilters {
  role?: UserRole;
  departmentId?: string;
  isActive?: boolean;
  search?: string;
  page?: number;
  limit?: number;
}

export class AdminService extends BaseService {
  private notificationService: NotificationService;

  constructor(prisma: PrismaClient) {
    super(prisma);
    this.notificationService = new NotificationService(prisma);
  }

  /**
   * Create a doctor with unique ID and send credentials
   */
  async createDoctor(input: CreateDoctorInput) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: input.email },
          { phone: input.phone },
        ],
      },
    });

    if (existingUser) {
      throw new APIError('User with this email or phone already exists', 400, 'USER_EXISTS');
    }

    // Verify department exists
    const department = await this.prisma.department.findUnique({
      where: { id: input.departmentId },
    });

    if (!department) {
      throw new APIError('Department not found', 404, 'DEPARTMENT_NOT_FOUND');
    }

    // Generate unique ID
    let uniqueId = uniqueIdUtils.generateDoctorId();
    
    // Ensure uniqueness
    while (await this.prisma.user.findUnique({ where: { unique_id: uniqueId } })) {
      uniqueId = uniqueIdUtils.generateDoctorId();
    }

    // Generate temporary password
    const temporaryPassword = this.generateTemporaryPassword();
    const passwordHash = await passwordUtils.hash(temporaryPassword);

    // Create user and doctor profile in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: input.email,
          phone: input.phone,
          password_hash: passwordHash,
          first_name: input.firstName,
          last_name: input.lastName,
          role: 'DOCTOR',
          unique_id: uniqueId,
          requires_password_change: true,
        },
      });

      const doctorProfile = await tx.doctorProfile.create({
        data: {
          user_id: user.id,
          department_id: input.departmentId,
          specialization: input.specialization,
          registration_number: input.registrationNumber,
          qualifications: input.qualifications,
          experience: input.experience,
          consultation_fee: input.consultationFee,
          follow_up_fee: input.followUpFee,
          video_consultation_fee: input.videoConsultationFee,
          languages: input.languages,
          bio: input.bio,
        },
      });

      return { user, doctorProfile };
    });

    // Send credentials via email
    try {
      await this.notificationService.send({
        type: 'EMAIL',
        template: 'USER_CREDENTIALS',
        recipient: { email: input.email },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          uniqueId,
          temporaryPassword,
          loginUrl: process.env.WEB_APP_URL || 'http://localhost:3000',
        },
      });
    } catch (error) {
      console.error('Failed to send credentials email:', error);
      // Don't fail the user creation if email fails
    }

    return {
      user: result.user,
      doctorProfile: result.doctorProfile,
      credentials: {
        uniqueId,
        temporaryPassword,
      },
    };
  }

  /**
   * Create a staff member with unique ID and send credentials
   */
  async createStaff(input: CreateStaffInput) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: input.email },
          { phone: input.phone },
        ],
      },
    });

    if (existingUser) {
      throw new APIError('User with this email or phone already exists', 400, 'USER_EXISTS');
    }

    // Verify department exists if provided
    if (input.departmentId) {
      const department = await this.prisma.department.findUnique({
        where: { id: input.departmentId },
      });

      if (!department) {
        throw new APIError('Department not found', 404, 'DEPARTMENT_NOT_FOUND');
      }
    }

    // Generate unique ID
    let uniqueId = uniqueIdUtils.generateStaffId();
    
    // Ensure uniqueness
    while (await this.prisma.user.findUnique({ where: { unique_id: uniqueId } })) {
      uniqueId = uniqueIdUtils.generateStaffId();
    }

    // Generate temporary password
    const temporaryPassword = this.generateTemporaryPassword();
    const passwordHash = await passwordUtils.hash(temporaryPassword);

    // Create user and staff profile in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: input.email,
          phone: input.phone,
          password_hash: passwordHash,
          first_name: input.firstName,
          last_name: input.lastName,
          role: 'RECEPTION', // Default role for staff
          unique_id: uniqueId,
          requires_password_change: true,
        },
      });

      const staffProfile = await tx.staffProfile.create({
        data: {
          user_id: user.id,
          staff_role: input.staffRole,
          department_id: input.departmentId,
          employee_id: input.employeeId,
          joining_date: input.joiningDate,
        },
      });

      return { user, staffProfile };
    });

    // Send credentials via email
    try {
      await this.notificationService.send({
        type: 'EMAIL',
        template: 'USER_CREDENTIALS',
        recipient: { email: input.email },
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          uniqueId,
          temporaryPassword,
          loginUrl: process.env.WEB_APP_URL || 'http://localhost:3000',
        },
      });
    } catch (error) {
      console.error('Failed to send credentials email:', error);
    }

    return {
      user: result.user,
      staffProfile: result.staffProfile,
      credentials: {
        uniqueId,
        temporaryPassword,
      },
    };
  }

  /**
   * Update user details
   */
  async updateUser(userId: string, input: UpdateUserInput) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new APIError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Check for email/phone conflicts
    if (input.email || input.phone) {
      const conflict = await this.prisma.user.findFirst({
        where: {
          AND: [
            { id: { not: userId } },
            {
              OR: [
                ...(input.email ? [{ email: input.email }] : []),
                ...(input.phone ? [{ phone: input.phone }] : []),
              ],
            },
          ],
        },
      });

      if (conflict) {
        throw new APIError('Email or phone already in use', 400, 'CONFLICT');
      }
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(input.email && { email: input.email }),
        ...(input.phone && { phone: input.phone }),
        ...(input.firstName && { first_name: input.firstName }),
        ...(input.lastName && { last_name: input.lastName }),
        ...(input.isActive !== undefined && { is_active: input.isActive }),
      },
      include: {
        doctor_profile: true,
        staff_profile: true,
        patient_profile: true,
      },
    });

    return updated;
  }

  /**
   * Deactivate user
   */
  async deactivateUser(userId: string) {
    return await this.updateUser(userId, { isActive: false });
  }

  /**
   * Activate user
   */
  async activateUser(userId: string) {
    return await this.updateUser(userId, { isActive: true });
  }

  /**
   * Reset user password
   */
  async resetUserPassword(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new APIError('User not found', 404, 'USER_NOT_FOUND');
    }

    const temporaryPassword = this.generateTemporaryPassword();
    const passwordHash = await passwordUtils.hash(temporaryPassword);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password_hash: passwordHash,
        requires_password_change: true,
      },
    });

    // Send new password via email
    try {
      await this.notificationService.send({
        type: 'EMAIL',
        template: 'PASSWORD_RESET',
        recipient: { email: user.email },
        data: {
          firstName: user.first_name,
          lastName: user.last_name,
          temporaryPassword,
        },
      });
    } catch (error) {
      console.error('Failed to send password reset email:', error);
    }

    return {
      success: true,
      temporaryPassword, // Return for admin to share if email fails
    };
  }

  /**
   * Generate temporary password
   */
  private generateTemporaryPassword(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  }

  /**
   * List users with filters and pagination
   */
  async listUsers(filters: UserListFilters) {
    const page = filters.page || 1;
    const limit = filters.limit || 50;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.role) {
      where.role = filters.role;
    }

    if (filters.isActive !== undefined) {
      where.is_active = filters.isActive;
    }

    if (filters.search) {
      where.OR = [
        { first_name: { contains: filters.search, mode: 'insensitive' } },
        { last_name: { contains: filters.search, mode: 'insensitive' } },
        { email: { contains: filters.search, mode: 'insensitive' } },
        { phone: { contains: filters.search, mode: 'insensitive' } },
        { unique_id: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    if (filters.departmentId) {
      where.OR = [
        {
          doctor_profile: {
            department_id: filters.departmentId,
          },
        },
        {
          staff_profile: {
            department_id: filters.departmentId,
          },
        },
      ];
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          email: true,
          phone: true,
          first_name: true,
          last_name: true,
          role: true,
          unique_id: true,
          is_active: true,
          requires_password_change: true,
          last_login: true,
          created_at: true,
          doctor_profile: {
            select: {
              specialization: true,
              department_id: true,
              registration_number: true,
            },
          },
          staff_profile: {
            select: {
              staff_role: true,
              department_id: true,
              employee_id: true,
            },
          },
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      users,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Get user by ID with full details
   */
  async getUserById(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        doctor_profile: {
          include: {
            department: true,
          },
        },
        staff_profile: {
          include: {
            department: true,
          },
        },
        patient_profile: true,
      },
    });

    if (!user) {
      throw new APIError('User not found', 404, 'USER_NOT_FOUND');
    }

    return user;
  }

  /**
   * Bulk import doctors from CSV/JSON
   */
  async bulkImportDoctors(doctors: CreateDoctorInput[]) {
    const results = {
      success: [] as any[],
      failed: [] as any[],
    };

    for (const doctor of doctors) {
      try {
        const result = await this.createDoctor(doctor);
        results.success.push({
          email: doctor.email,
          uniqueId: result.credentials.uniqueId,
        });
      } catch (error) {
        results.failed.push({
          email: doctor.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  /**
   * Bulk import staff from CSV/JSON
   */
  async bulkImportStaff(staff: CreateStaffInput[]) {
    const results = {
      success: [] as any[],
      failed: [] as any[],
    };

    for (const member of staff) {
      try {
        const result = await this.createStaff(member);
        results.success.push({
          email: member.email,
          uniqueId: result.credentials.uniqueId,
        });
      } catch (error) {
        results.failed.push({
          email: member.email,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  /**
   * Get dashboard statistics
   */
  async getDashboardStats() {
    const [
      totalDoctors,
      totalStaff,
      totalPatients,
      activeDoctors,
      activeStaff,
      recentUsers,
    ] = await Promise.all([
      this.prisma.user.count({ where: { role: 'DOCTOR' } }),
      this.prisma.user.count({ where: { role: 'RECEPTION' } }),
      this.prisma.user.count({ where: { role: 'PATIENT' } }),
      this.prisma.user.count({ where: { role: 'DOCTOR', is_active: true } }),
      this.prisma.user.count({ where: { role: 'RECEPTION', is_active: true } }),
      this.prisma.user.findMany({
        take: 10,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          role: true,
          created_at: true,
        },
      }),
    ]);

    return {
      totalDoctors,
      totalStaff,
      totalPatients,
      activeDoctors,
      activeStaff,
      recentUsers,
    };
  }
}

