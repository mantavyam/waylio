import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuditLogOptions {
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'PASSWORD_RESET' | 'ACTIVATE' | 'DEACTIVATE' | 'BULK_IMPORT';
  resourceType: 'USER' | 'DOCTOR' | 'STAFF' | 'PATIENT' | 'HOSPITAL' | 'DEPARTMENT' | 'HOLIDAY' | 'APPOINTMENT' | 'PRESCRIPTION' | 'PARKING';
  getResourceId?: (request: FastifyRequest) => string | null;
  getChanges?: (request: FastifyRequest, reply: FastifyReply) => Promise<any> | any;
}

/**
 * Middleware to log admin actions to audit log
 */
export function auditLog(options: AuditLogOptions) {
  return async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    // Store original send function
    const originalSend = reply.send.bind(reply);

    // Override send to capture response
    reply.send = function (payload: any) {
      // Don't wait for audit log to complete
      void (async () => {
        try {
          if (!request.user) {
            return;
          }

          // Get resource ID
          let resourceId: string | null = null;
          if (options.getResourceId) {
            resourceId = options.getResourceId(request);
          } else if (request.params && typeof request.params === 'object' && 'id' in request.params) {
            resourceId = (request.params as any).id;
          }

          // Get changes
          let changes: any = null;
          if (options.getChanges) {
            changes = await options.getChanges(request, reply);
          } else if (request.body) {
            changes = {
              before: null,
              after: request.body,
            };
          }

          // Create audit log entry
          await prisma.auditLog.create({
            data: {
              user_id: request.user.userId,
              action: options.action,
              resource_type: options.resourceType,
              resource_id: resourceId || '',
              changes,
              ip_address: request.ip,
              user_agent: request.headers['user-agent'] || null,
            },
          });
        } catch (error) {
          // Log error but don't fail the request
          console.error('Failed to create audit log:', error);
        }
      })();

      // Call original send
      return originalSend(payload);
    };
  };
}

/**
 * Create audit log entry manually
 */
export async function createAuditLog(
  userId: string,
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'PASSWORD_RESET' | 'ACTIVATE' | 'DEACTIVATE' | 'BULK_IMPORT',
  resourceType: 'USER' | 'DOCTOR' | 'STAFF' | 'PATIENT' | 'HOSPITAL' | 'DEPARTMENT' | 'HOLIDAY' | 'APPOINTMENT' | 'PRESCRIPTION' | 'PARKING',
  resourceId: string | null,
  changes: any,
  ipAddress?: string,
  userAgent?: string
) {
  try {
    await prisma.auditLog.create({
      data: {
        user_id: userId,
        action,
        resource_type: resourceType,
        resource_id: resourceId || '',
        changes,
        ip_address: ipAddress || null,
        user_agent: userAgent || null,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

/**
 * Get audit logs with filters
 */
export async function getAuditLogs(filters: {
  userId?: string;
  action?: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'PASSWORD_RESET' | 'ACTIVATE' | 'DEACTIVATE' | 'BULK_IMPORT';
  resourceType?: 'USER' | 'DOCTOR' | 'STAFF' | 'PATIENT' | 'HOSPITAL' | 'DEPARTMENT' | 'HOLIDAY' | 'APPOINTMENT' | 'PRESCRIPTION' | 'PARKING';
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}) {
  const page = filters.page || 1;
  const limit = filters.limit || 50;
  const skip = (page - 1) * limit;

  const where: any = {};

  if (filters.userId) where.user_id = filters.userId;
  if (filters.action) where.action = filters.action;
  if (filters.resourceType) where.resource_type = filters.resourceType;
  if (filters.resourceId) where.resource_id = filters.resourceId;
  
  if (filters.startDate || filters.endDate) {
    where.created_at = {};
    if (filters.startDate) where.created_at.gte = filters.startDate;
    if (filters.endDate) where.created_at.lte = filters.endDate;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { created_at: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            first_name: true,
            last_name: true,
            role: true,
          },
        },
      },
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Audit log decorator for service methods
 */
export function AuditActionDecorator(
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'PASSWORD_RESET' | 'ACTIVATE' | 'DEACTIVATE' | 'BULK_IMPORT',
  resourceType: 'USER' | 'DOCTOR' | 'STAFF' | 'PATIENT' | 'HOSPITAL' | 'DEPARTMENT' | 'HOLIDAY' | 'APPOINTMENT' | 'PRESCRIPTION' | 'PARKING',
  getResourceId?: (args: any[]) => string | null
) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await originalMethod.apply(this, args);

      // Create audit log after successful operation
      try {
        const userId = (this as any).userId || null;
        const resourceId = getResourceId ? getResourceId(args) : null;

        if (userId) {
          await createAuditLog(
            userId,
            action,
            resourceType,
            resourceId,
            {
              args,
              result,
            }
          );
        }
      } catch (error) {
        console.error('Failed to create audit log:', error);
      }

      return result;
    };

    return descriptor;
  };
}

