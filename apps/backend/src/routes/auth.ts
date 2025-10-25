import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { AuthService } from '../services/AuthService.js';
import { authenticate } from '../middleware/auth.js';

const registerSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(10),
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(['PATIENT', 'DOCTOR', 'RECEPTION', 'ADMIN']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify.prisma);

  // Register
  fastify.post('/register', async (request, reply) => {
    const body = registerSchema.parse(request.body);

    const result = await authService.register({
      email: body.email,
      phone: body.phone,
      password: body.password,
      firstName: body.firstName,
      lastName: body.lastName,
      role: body.role,
    });

    return reply.code(201).send(result);
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    const body = loginSchema.parse(request.body);

    const result = await authService.login({
      email: body.email,
      password: body.password,
    });

    return reply.send(result);
  });

  // Refresh token
  fastify.post('/refresh', async (request, reply) => {
    const body = refreshTokenSchema.parse(request.body);

    const result = await authService.refreshToken(body.refreshToken);

    return reply.send(result);
  });

  // Get profile (protected)
  fastify.get('/profile', {
    preHandler: [authenticate],
  }, async (request, reply) => {
    const userId = request.user!.userId;

    const profile = await authService.getProfile(userId);

    return reply.send(profile);
  });

  // Logout (client-side token removal, but we can add token blacklisting later)
  fastify.post('/logout', {
    preHandler: [authenticate],
  }, async (request, reply) => {
    return reply.send({ message: 'Logged out successfully' });
  });
}
