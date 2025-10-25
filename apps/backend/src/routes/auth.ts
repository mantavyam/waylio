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
  identifier: z.string().min(1), // Email, phone, or uniqueId
  password: z.string(),
  role: z.enum(['PATIENT', 'DOCTOR', 'RECEPTION', 'ADMIN']).optional(),
});

const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

const sendOTPSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
  purpose: z.enum(['VERIFICATION', 'PASSWORD_RESET', 'TWO_FACTOR_AUTH']),
});

const verifyOTPSchema = z.object({
  phone: z.string().optional(),
  email: z.string().email().optional(),
  otp: z.string().length(6),
  purpose: z.enum(['VERIFICATION', 'PASSWORD_RESET', 'TWO_FACTOR_AUTH']),
});

const forgotPasswordSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

const resetPasswordSchema = z.object({
  resetToken: z.string(),
  newPassword: z.string().min(8),
});

const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: z.string().min(8),
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
      identifier: body.identifier,
      password: body.password,
      role: body.role,
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
  }, async (_request, reply) => {
    return reply.send({ message: 'Logged out successfully' });
  });

  // Send OTP
  fastify.post('/send-otp', async (request, reply) => {
    const body = sendOTPSchema.parse(request.body);

    const result = await authService.sendOTP({
      phone: body.phone,
      email: body.email,
      purpose: body.purpose,
    });

    return reply.send(result);
  });

  // Verify OTP
  fastify.post('/verify-otp', async (request, reply) => {
    const body = verifyOTPSchema.parse(request.body);

    const result = await authService.verifyOTP({
      phone: body.phone,
      email: body.email,
      otp: body.otp,
      purpose: body.purpose,
    });

    return reply.send(result);
  });

  // Forgot password
  fastify.post('/forgot-password', async (request, reply) => {
    const body = forgotPasswordSchema.parse(request.body);

    const result = await authService.forgotPassword({
      email: body.email,
      phone: body.phone,
    });

    return reply.send(result);
  });

  // Reset password
  fastify.post('/reset-password', async (request, reply) => {
    const body = resetPasswordSchema.parse(request.body);

    const result = await authService.resetPassword({
      resetToken: body.resetToken,
      newPassword: body.newPassword,
    });

    return reply.send(result);
  });

  // Change password (protected)
  fastify.post('/change-password', {
    preHandler: [authenticate],
  }, async (request, reply) => {
    const body = changePasswordSchema.parse(request.body);
    const userId = request.user!.userId;

    const result = await authService.changePassword({
      userId,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    });

    return reply.send(result);
  });
}
