import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { HospitalService } from '../services/HospitalService.js';
import { authenticate } from '../middleware/auth.js';
import { requirePermissions, Permission } from '../middleware/rbac.js';
import { auditLog } from '../middleware/auditLog.js';

const createHospitalSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.string().min(1),
  zipCode: z.string().min(1),
  country: z.string().min(1),
  phone: z.string().min(1),
  email: z.string().email(),
  website: z.string().url().optional(),
  description: z.string().optional(),
  operatingHours: z.any(),
  emergencyContact: z.string().min(1),
});

const updateHospitalSchema = z.object({
  name: z.string().min(1).optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  zipCode: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  phone: z.string().min(1).optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  logoUrl: z.string().url().optional(),
  description: z.string().optional(),
  operatingHours: z.any().optional(),
  emergencyContact: z.string().min(1).optional(),
});

const createDepartmentSchema = z.object({
  hospitalId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  building: z.string().min(1),
  floor: z.number().int(),
  wing: z.string().optional(),
  headDoctorId: z.string().uuid().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  operatingHours: z.any().optional(),
  services: z.array(z.string()),
});

const updateDepartmentSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  building: z.string().min(1).optional(),
  floor: z.number().int().optional(),
  wing: z.string().optional(),
  headDoctorId: z.string().uuid().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  operatingHours: z.any().optional(),
  services: z.array(z.string()).optional(),
  isActive: z.boolean().optional(),
});

const createHolidaySchema = z.object({
  hospitalId: z.string().uuid(),
  name: z.string().min(1),
  date: z.string().transform(str => new Date(str)),
  isRecurring: z.boolean(),
});

export default async function hospitalRoutes(fastify: FastifyInstance) {
  const hospitalService = new HospitalService(fastify.prisma);

  // Get hospital profile
  fastify.get('/', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.HOSPITAL_VIEW),
    ],
  }, async (_request, reply) => {
    const hospital = await hospitalService.getHospital();
    return reply.send(hospital);
  });

  // Create hospital profile
  fastify.post('/', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.HOSPITAL_EDIT),
      auditLog({
        action: 'CREATE',
        resourceType: 'HOSPITAL',
      }),
    ],
  }, async (request, reply) => {
    const body = createHospitalSchema.parse(request.body);

    const hospital = await hospitalService.createHospital({
      name: body.name,
      address: body.address,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      country: body.country,
      phone: body.phone,
      email: body.email,
      website: body.website,
      description: body.description,
      operatingHours: body.operatingHours,
      emergencyContact: body.emergencyContact,
    });

    return reply.status(201).send(hospital);
  });

  // Update hospital profile
  fastify.patch('/:id', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.HOSPITAL_EDIT),
      auditLog({
        action: 'UPDATE',
        resourceType: 'HOSPITAL',
      }),
    ],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateHospitalSchema.parse(request.body);

    const hospital = await hospitalService.updateHospital(id, {
      name: body.name,
      address: body.address,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      country: body.country,
      phone: body.phone,
      email: body.email,
      website: body.website,
      logoUrl: body.logoUrl,
      description: body.description,
      operatingHours: body.operatingHours,
      emergencyContact: body.emergencyContact,
    });

    return reply.send(hospital);
  });

  // List departments
  fastify.get('/departments', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.DEPARTMENT_VIEW),
    ],
  }, async (request, reply) => {
    const { hospitalId, isActive } = request.query as {
      hospitalId?: string;
      isActive?: string;
    };

    const result = await hospitalService.listDepartments({
      hospitalId,
      isActive: isActive ? isActive === 'true' : undefined,
    });

    return reply.send(result);
  });

  // Get department by ID
  fastify.get('/departments/:id', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.DEPARTMENT_VIEW),
    ],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const department = await hospitalService.getDepartment(id);
    return reply.send(department);
  });

  // Create department
  fastify.post('/departments', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.DEPARTMENT_CREATE),
      auditLog({
        action: 'CREATE',
        resourceType: 'DEPARTMENT',
      }),
    ],
  }, async (request, reply) => {
    const body = createDepartmentSchema.parse(request.body);

    const department = await hospitalService.createDepartment({
      hospitalId: body.hospitalId,
      name: body.name,
      description: body.description,
      building: body.building,
      floor: body.floor,
      wing: body.wing,
      headDoctorId: body.headDoctorId,
      phone: body.phone,
      email: body.email,
      operatingHours: body.operatingHours,
      services: body.services,
    });

    return reply.status(201).send(department);
  });

  // Update department
  fastify.patch('/departments/:id', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.DEPARTMENT_EDIT),
      auditLog({
        action: 'UPDATE',
        resourceType: 'DEPARTMENT',
      }),
    ],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const body = updateDepartmentSchema.parse(request.body);

    const department = await hospitalService.updateDepartment(id, body);
    return reply.send(department);
  });

  // Delete department
  fastify.delete('/departments/:id', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.DEPARTMENT_DELETE),
      auditLog({
        action: 'DELETE',
        resourceType: 'DEPARTMENT',
      }),
    ],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const result = await hospitalService.deleteDepartment(id);
    return reply.send(result);
  });

  // List holidays
  fastify.get('/holidays', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.HOSPITAL_VIEW),
    ],
  }, async (request, reply) => {
    const { hospitalId, year } = request.query as {
      hospitalId: string;
      year?: string;
    };

    const holidays = await hospitalService.listHolidays(
      hospitalId,
      year ? parseInt(year) : undefined
    );

    return reply.send(holidays);
  });

  // Create holiday
  fastify.post('/holidays', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.HOSPITAL_EDIT),
      auditLog({
        action: 'CREATE',
        resourceType: 'HOLIDAY',
      }),
    ],
  }, async (request, reply) => {
    const body = createHolidaySchema.parse(request.body);

    const holiday = await hospitalService.createHoliday({
      hospitalId: body.hospitalId,
      name: body.name,
      date: body.date,
      isRecurring: body.isRecurring,
    });

    return reply.status(201).send(holiday);
  });

  // Delete holiday
  fastify.delete('/holidays/:id', {
    preHandler: [
      authenticate,
      requirePermissions(Permission.HOSPITAL_EDIT),
      auditLog({
        action: 'DELETE',
        resourceType: 'HOLIDAY',
      }),
    ],
  }, async (request, reply) => {
    const { id } = request.params as { id: string };
    const result = await hospitalService.deleteHoliday(id);
    return reply.send(result);
  });
}

