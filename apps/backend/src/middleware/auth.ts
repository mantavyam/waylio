import { FastifyRequest, FastifyReply } from 'fastify';
import { jwtUtils } from '../utils/jwt.js';
import { APIError } from '../utils/APIError.js';

export async function authenticate(
  request: FastifyRequest,
  _reply: FastifyReply
): Promise<void> {
  try {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new APIError('No token provided', 401, 'UNAUTHORIZED');
    }

    const token = authHeader.substring(7);
    const payload = jwtUtils.verifyAccessToken(token);

    request.user = payload;
  } catch (err) {
    if (err instanceof APIError) {
      throw err;
    }
    throw new APIError('Invalid or expired token', 401, 'UNAUTHORIZED');
  }
}

export function requireRole(...allowedRoles: Array<'PATIENT' | 'DOCTOR' | 'RECEPTION' | 'ADMIN'>) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      throw new APIError('Authentication required', 401, 'UNAUTHORIZED');
    }

    if (!allowedRoles.includes(request.user.role)) {
      throw new APIError(
        'Insufficient permissions',
        403,
        'FORBIDDEN'
      );
    }
  };
}

