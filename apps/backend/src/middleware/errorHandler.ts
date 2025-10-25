import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import type { ApiError } from '@waylio/shared-ts';
import { nanoid } from 'nanoid';
import { APIError } from '../utils/APIError.js';
import { ZodError } from 'zod';

export const errorHandler = (
  error: FastifyError | APIError | ZodError | Error,
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

  // Handle Zod validation errors
  if (error instanceof ZodError) {
    const response: ApiError = {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request data',
        details: error.errors,
        timestamp: new Date().toISOString(),
        requestId,
      },
    };
    return reply.status(400).send(response);
  }

  // Handle APIError
  if (error instanceof APIError) {
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
