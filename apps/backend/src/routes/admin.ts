import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AdminService } from '../services/AdminService.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermissions, requireAdmin, Permission } from '../middleware/rbac.js';
import { auditLog } from '../middleware/auditLog.js';
import { getAuditLogs } from '../middleware/auditLog.js';

const createDoctorSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  specialization: z.string().min(1),
  departmentId: z.string().uuid(),
  registrationNumber: z.string().min(1),
  qualifications: z.array(z.string()),
  experience: z.number().int().min(0),
  consultationFee: z.number().min(0),
  followUpFee: z.number().min(0).optional(),
  videoConsultationFee: z.number().min(0).optional(),
  languages: z.array(z.string()),
  bio: z.string().optional(),
});

const createStaffSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  staffRole: z.enum(['RECEPTIONIST', 'NURSE', 'TECHNICIAN', 'PHARMACIST', 'ADMIN_STAFF', 'SECURITY', 'HOUSEKEEPING', 'OTHER']),
  departmentId: z.string().uuid().optional(),
  employeeId: z.string().optional(),
  joiningDate: z.string().transform(str => new Date(str)),
});

const updateUserSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(1).optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  isActive: z.boolean().optional(),
});

const userListQuerySchema = z.object({
  role: z.enum(['PATIENT', 'DOCTOR', 'RECEPTION', 'ADMIN']).optional(),
  departmentId: z.string().uuid().optional(),
  isActive: z.string().optional(),
  search: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});

export default async function adminRoutes(fastify: FastifyInstance) {
  const adminService = new AdminService(fastify.prisma);

  // Get dashboard statistics
  fastify.get('/dashboard/stats', {
    preHandler: [
      authenticate,
      requireAdmin(),
    ],
  }, async (_request, reply) => {
    const stats = await adminService.getDashboardStats();
    return reply.send(stats);
  });

  // List users
  fastify.get('/users', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.USER_VIEW),
    ],
  }, async (request, reply) => {
    const query = userListQuerySchema.parse(request.query);

    const result = await adminService.listUsers({
      role: query.role,
      departmentId: query.departmentId,
      isActive: query.isActive ? query.isActive === 'true' : undefined,
      search: query.search,
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
    });

    return reply.send(result);
  });

  // Get user by ID
  fastify.get('/users/:id', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.USER_VIEW),
    ],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = await adminService.getUserById(id);
    return reply.send(user);
  });

  // Create doctor
  fastify.post('/doctors', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.DOCTOR_CREATE),
      auditLog({
        action: 'CREATE',
        resourceType: 'USER',
      }),
    ],
  }, async (request, reply) => {
    const body = createDoctorSchema.parse(request.body);

    const result = await adminService.createDoctor({
      email: body.email,
      phone: body.phone,
      firstName: body.firstName,
      lastName: body.lastName,
      specialization: body.specialization,
      departmentId: body.departmentId,
      registrationNumber: body.registrationNumber,
      qualifications: body.qualifications,
      experience: body.experience,
      consultationFee: body.consultationFee,
      followUpFee: body.followUpFee,
      videoConsultationFee: body.videoConsultationFee,
      languages: body.languages,
      bio: body.bio,
    });

    return reply.status(201).send(result);
  });

  // Create staff
  fastify.post('/staff', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.STAFF_CREATE),
      auditLog({
        action: 'CREATE',
        resourceType: 'USER',
      }),
    ],
  }, async (request, reply) => {
    const body = createStaffSchema.parse(request.body);

    const result = await adminService.createStaff({
      email: body.email,
      phone: body.phone,
      firstName: body.firstName,
      lastName: body.lastName,
      staffRole: body.staffRole,
      departmentId: body.departmentId,
      employeeId: body.employeeId,
      joiningDate: body.joiningDate,
    });

    return reply.status(201).send(result);
  });

  // Update user
  fastify.patch('/users/:id', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.USER_EDIT),
      auditLog({
        action: 'UPDATE',
        resourceType: 'USER',
      }),
    ],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateUserSchema.parse(request.body);

    const user = await adminService.updateUser(id, {
      email: body.email,
      phone: body.phone,
      firstName: body.firstName,
      lastName: body.lastName,
      isActive: body.isActive,
    });

    return reply.send(user);
  });

  // Deactivate user
  fastify.post('/users/:id/deactivate', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.USER_DELETE),
      auditLog({
        action: 'DELETE',
        resourceType: 'USER',
      }),
    ],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = await adminService.deactivateUser(id);
    return reply.send(user);
  });

  // Activate user
  fastify.post('/users/:id/activate', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.USER_EDIT),
      auditLog({
        action: 'UPDATE',
        resourceType: 'USER',
      }),
    ],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const user = await adminService.activateUser(id);
    return reply.send(user);
  });

  // Reset user password
  fastify.post('/users/:id/reset-password', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.USER_RESET_PASSWORD),
      auditLog({
        action: 'UPDATE',
        resourceType: 'USER',
      }),
    ],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const result = await adminService.resetUserPassword(id);
    return reply.send(result);
  });

  // Bulk import doctors
  fastify.post('/doctors/bulk-import', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.DOCTOR_CREATE),
      auditLog({
        action: 'CREATE',
        resourceType: 'USER',
      }),
    ],
  }, async (request, reply) => {
    const body = z.array(createDoctorSchema).parse(request.body);

    const result = await adminService.bulkImportDoctors(body);
    return reply.send(result);
  });

  // Bulk import staff
  fastify.post('/staff/bulk-import', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.STAFF_CREATE),
      auditLog({
        action: 'CREATE',
        resourceType: 'USER',
      }),
    ],
  }, async (request, reply) => {
    const body = z.array(createStaffSchema).parse(request.body);

    const result = await adminService.bulkImportStaff(body);
    return reply.send(result);
  });

  // Get audit logs
  fastify.get('/audit-logs', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.AUDIT_VIEW),
    ],
  }, async (request, reply) => {
    const query = request.query as any;

    const result = await getAuditLogs({
      userId: query.userId,
      action: query.action,
      resourceType: query.resourceType,
      resourceId: query.resourceId,
      startDate: query.startDate ? new Date(query.startDate) : undefined,
      endDate: query.endDate ? new Date(query.endDate) : undefined,
      page: query.page ? parseInt(query.page) : undefined,
      limit: query.limit ? parseInt(query.limit) : undefined,
    });

    return reply.send(result);
  });
}

