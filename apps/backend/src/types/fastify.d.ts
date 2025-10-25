import { PrismaClient } from '@prisma/client';
import { JWTPayload } from '../utils/jwt.js';

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: JWTPayload;
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user: JWTPayload;
  }
}

export {};
