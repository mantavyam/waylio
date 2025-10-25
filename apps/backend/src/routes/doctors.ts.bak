import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { DoctorService } from '../services/DoctorService.js';
import { authenticate, requireRole } from '../middleware/auth.js';

const searchDoctorsSchema = z.object({
  department: z.string().optional(),
  specialization: z.string().optional(),
  name: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
});

const updateProfileSchema = z.object({
  specialization: z.string().optional(),
  department: z.string().optional(),
  consultationFee: z.number().optional(),
  availability: z.any().optional(),
});

export async function doctorRoutes(fastify: FastifyInstance) {
  const doctorService = new DoctorService(fastify.prisma);

  // Search doctors (public or authenticated)
  fastify.get('/search', async (request, reply) => {
    const query = request.query as any;
    const params = searchDoctorsSchema.parse({
      department: query.department,
      specialization: query.specialization,
      name: query.name,
      limit: query.limit ? parseInt(query.limit) : undefined,
      offset: query.offset ? parseInt(query.offset) : undefined,
    });
    
    const doctors = await doctorService.searchDoctors(params);

    return reply.send(doctors);
  });

  // Get doctor by ID
  fastify.get('/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    
    const doctor = await doctorService.getDoctorById(id);

    return reply.send(doctor);
  });

  // Get doctor's schedule
  fastify.get('/:id/schedule', async (request, reply) => {
    const { id } = request.params as { id: string };
    const query = request.query as any;
    const date = query.date ? new Date(query.date) : new Date();
    
    const schedule = await doctorService.getDoctorSchedule(id, date);

    return reply.send(schedule);
  });

  // Update doctor profile (Doctor only)
  fastify.patch('/profile', {
    preHandler: [authenticate, requireRole('DOCTOR')],
  }, async (request, reply) => {
    const doctorId = request.user!.userId;
    const body = updateProfileSchema.parse(request.body);
    
    const profile = await doctorService.updateDoctorProfile(doctorId, body);

    return reply.send(profile);
  });

  // Get all departments
  fastify.get('/meta/departments', async (request, reply) => {
    const departments = await doctorService.getDepartments();

    return reply.send(departments);
  });

  // Get all specializations
  fastify.get('/meta/specializations', async (request, reply) => {
    const specializations = await doctorService.getSpecializations();

    return reply.send(specializations);
  });
}

