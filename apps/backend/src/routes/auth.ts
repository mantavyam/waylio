import { FastifyInstance } from 'fastify';

export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/register', async (request, reply) => {
    // TODO: Implement user registration
    return { message: 'Registration endpoint - to be implemented' };
  });

  fastify.post('/login', async (request, reply) => {
    // TODO: Implement user login
    return { message: 'Login endpoint - to be implemented' };
  });
}
