import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import cookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import { PrismaClient } from '@prisma/client';
import { env } from './config/env.js';
import { redisClient } from './config/redis.js';
import { initializeSocket } from './config/socket.js';
import { errorHandler } from './middleware/errorHandler.js';
import { appointmentRoutes } from './routes/appointments.js';
import { authRoutes } from './routes/auth.js';
// import { doctorRoutes } from './routes/doctors.js'; // Phase 2
import hospitalRoutes from './routes/hospital.js';
import adminRoutes from './routes/admin.js';

const prisma = new PrismaClient();
const fastify = Fastify({
  logger: {
    level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  },
});

// Register plugins
await fastify.register(cors, {
  origin: env.CORS_ORIGIN,
  credentials: true,
});

await fastify.register(jwt, {
  secret: env.JWT_SECRET,
});

await fastify.register(cookie);

await fastify.register(multipart, {
  limits: {
    fileSize: env.MAX_FILE_SIZE,
  },
});

// Decorate fastify with prisma
fastify.decorate('prisma', prisma);

// Health check
fastify.get('/health', async () => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    redis: redisClient.isOpen ? 'connected' : 'disconnected',
  };
});

// Register routes
await fastify.register(authRoutes, { prefix: '/api/v1/auth' });
await fastify.register(appointmentRoutes, { prefix: '/api/v1/appointments' });
// await fastify.register(doctorRoutes, { prefix: '/api/v1/doctors' }); // Phase 2
await fastify.register(hospitalRoutes, { prefix: '/api/v1/hospital' });
await fastify.register(adminRoutes, { prefix: '/api/v1/admin' });

// Error handler
fastify.setErrorHandler(errorHandler);

// Start server
const start = async () => {
  try {
    const port = env.PORT;
    await fastify.listen({ port, host: '0.0.0.0' });

    // Initialize Socket.IO
    const httpServer = fastify.server;
    initializeSocket(httpServer);

    console.log(`🚀 Backend server running on port ${port}`);
    console.log(`🔌 WebSocket server ready`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();

// Graceful shutdown
process.on('SIGTERM', async () => {
  await redisClient.quit();
  await prisma.$disconnect();
  await fastify.close();
});
