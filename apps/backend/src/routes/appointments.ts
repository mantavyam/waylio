import { FastifyInstance } from 'fastify';
import type { ApiResponse, Appointment } from '@waylio/shared-ts';

export async function appointmentRoutes(fastify: FastifyInstance) {
  fastify.get('/', async (request, reply) => {
    // TODO: Implement get appointments
    const response: ApiResponse<Appointment[]> = {
      success: true,
      data: [],
    };
    return response;
  });

  fastify.post('/', async (request, reply) => {
    // TODO: Implement create appointment
    return { message: 'Create appointment - to be implemented' };
  });
}
