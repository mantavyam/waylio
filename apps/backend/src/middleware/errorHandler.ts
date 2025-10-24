import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import type { ApiError } from '@waylio/shared-ts';
import { nanoid } from 'nanoid';

export class AppError extends Error {
  constructor(
    public code: string,
    public message: string,
    public statusCode: number = 500,
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const errorHandler = (
  error: FastifyError | AppError,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const requestId = nanoid(10);
  
  // Log error (exclude PII)
  request.log.error({
    requestId,
    error: error.message,
    code: 'code' in error ? error.code : 'INTERNAL_ERROR',
    path: request.url,
  });

  if (error instanceof AppError) {
    const response: ApiError = {
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
        timestamp: new Date().toISOString(),
        requestId,
      },
    };
    return reply.status(error.statusCode).send(response);
  }

  // Default error response
  const response: ApiError = {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred. Please try again later.',
      timestamp: new Date().toISOString(),
      requestId,
    },
  };

  return reply.status(500).send(response);
};
