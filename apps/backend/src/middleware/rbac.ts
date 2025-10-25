import { FastifyRequest, FastifyReply } from 'fastify';
import { UserRole } from '@prisma/client';
import { APIError } from '../utils/APIError.js';

/**
 * Permission types for RBAC
 */
export enum Permission {
  // Hospital Management
  HOSPITAL_VIEW = 'hospital:view',
  HOSPITAL_EDIT = 'hospital:edit',
  
  // Department Management
  DEPARTMENT_VIEW = 'department:view',
  DEPARTMENT_CREATE = 'department:create',
  DEPARTMENT_EDIT = 'department:edit',
  DEPARTMENT_DELETE = 'department:delete',
  
  // User Management
  USER_VIEW = 'user:view',
  USER_CREATE = 'user:create',
  USER_EDIT = 'user:edit',
  USER_DELETE = 'user:delete',
  USER_RESET_PASSWORD = 'user:reset_password',
  
  // Doctor Management
  DOCTOR_VIEW = 'doctor:view',
  DOCTOR_CREATE = 'doctor:create',
  DOCTOR_EDIT = 'doctor:edit',
  DOCTOR_DELETE = 'doctor:delete',
  
  // Staff Management
  STAFF_VIEW = 'staff:view',
  STAFF_CREATE = 'staff:create',
  STAFF_EDIT = 'staff:edit',
  STAFF_DELETE = 'staff:delete',
  
  // Patient Management
  PATIENT_VIEW = 'patient:view',
  PATIENT_EDIT = 'patient:edit',
  
  // Appointment Management
  APPOINTMENT_VIEW = 'appointment:view',
  APPOINTMENT_CREATE = 'appointment:create',
  APPOINTMENT_EDIT = 'appointment:edit',
  APPOINTMENT_CANCEL = 'appointment:cancel',
  
  // Queue Management
  QUEUE_VIEW = 'queue:view',
  QUEUE_MANAGE = 'queue:manage',
  
  // Prescription Management
  PRESCRIPTION_VIEW = 'prescription:view',
  PRESCRIPTION_CREATE = 'prescription:create',
  PRESCRIPTION_EDIT = 'prescription:edit',
  
  // Parking Management
  PARKING_VIEW = 'parking:view',
  PARKING_MANAGE = 'parking:manage',
  
  // Notification Management
  NOTIFICATION_VIEW = 'notification:view',
  NOTIFICATION_SEND = 'notification:send',
  
  // Audit Log
  AUDIT_VIEW = 'audit:view',
  
  // Settings
  SETTINGS_VIEW = 'settings:view',
  SETTINGS_EDIT = 'settings:edit',
}

/**
 * Permission matrix mapping roles to their allowed permissions
 */
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  ADMIN: [
    // Full access to everything
    Permission.HOSPITAL_VIEW,
    Permission.HOSPITAL_EDIT,
    Permission.DEPARTMENT_VIEW,
    Permission.DEPARTMENT_CREATE,
    Permission.DEPARTMENT_EDIT,
    Permission.DEPARTMENT_DELETE,
    Permission.USER_VIEW,
    Permission.USER_CREATE,
    Permission.USER_EDIT,
    Permission.USER_DELETE,
    Permission.USER_RESET_PASSWORD,
    Permission.DOCTOR_VIEW,
    Permission.DOCTOR_CREATE,
    Permission.DOCTOR_EDIT,
    Permission.DOCTOR_DELETE,
    Permission.STAFF_VIEW,
    Permission.STAFF_CREATE,
    Permission.STAFF_EDIT,
    Permission.STAFF_DELETE,
    Permission.PATIENT_VIEW,
    Permission.PATIENT_EDIT,
    Permission.APPOINTMENT_VIEW,
    Permission.APPOINTMENT_CREATE,
    Permission.APPOINTMENT_EDIT,
    Permission.APPOINTMENT_CANCEL,
    Permission.QUEUE_VIEW,
    Permission.QUEUE_MANAGE,
    Permission.PRESCRIPTION_VIEW,
    Permission.PRESCRIPTION_CREATE,
    Permission.PRESCRIPTION_EDIT,
    Permission.PARKING_VIEW,
    Permission.PARKING_MANAGE,
    Permission.NOTIFICATION_VIEW,
    Permission.NOTIFICATION_SEND,
    Permission.AUDIT_VIEW,
    Permission.SETTINGS_VIEW,
    Permission.SETTINGS_EDIT,
  ],
  
  DOCTOR: [
    // View hospital and department info
    Permission.HOSPITAL_VIEW,
    Permission.DEPARTMENT_VIEW,
    
    // View other doctors
    Permission.DOCTOR_VIEW,
    
    // View and manage patients
    Permission.PATIENT_VIEW,
    Permission.PATIENT_EDIT,
    
    // Manage appointments
    Permission.APPOINTMENT_VIEW,
    Permission.APPOINTMENT_EDIT,
    Permission.APPOINTMENT_CANCEL,
    
    // Manage queue
    Permission.QUEUE_VIEW,
    Permission.QUEUE_MANAGE,
    
    // Manage prescriptions
    Permission.PRESCRIPTION_VIEW,
    Permission.PRESCRIPTION_CREATE,
    Permission.PRESCRIPTION_EDIT,
    
    // View notifications
    Permission.NOTIFICATION_VIEW,
  ],
  
  RECEPTION: [
    // View hospital and department info
    Permission.HOSPITAL_VIEW,
    Permission.DEPARTMENT_VIEW,
    
    // View doctors and staff
    Permission.DOCTOR_VIEW,
    Permission.STAFF_VIEW,
    
    // Manage patients
    Permission.PATIENT_VIEW,
    Permission.PATIENT_EDIT,
    
    // Manage appointments
    Permission.APPOINTMENT_VIEW,
    Permission.APPOINTMENT_CREATE,
    Permission.APPOINTMENT_EDIT,
    Permission.APPOINTMENT_CANCEL,
    
    // Manage queue
    Permission.QUEUE_VIEW,
    Permission.QUEUE_MANAGE,
    
    // View prescriptions
    Permission.PRESCRIPTION_VIEW,
    
    // Manage parking
    Permission.PARKING_VIEW,
    Permission.PARKING_MANAGE,
    
    // View notifications
    Permission.NOTIFICATION_VIEW,
  ],
  
  PATIENT: [
    // View hospital and department info
    Permission.HOSPITAL_VIEW,
    Permission.DEPARTMENT_VIEW,
    
    // View doctors
    Permission.DOCTOR_VIEW,
    
    // View own appointments
    Permission.APPOINTMENT_VIEW,
    Permission.APPOINTMENT_CREATE,
    Permission.APPOINTMENT_CANCEL,
    
    // View queue status
    Permission.QUEUE_VIEW,
    
    // View own prescriptions
    Permission.PRESCRIPTION_VIEW,
    
    // Manage parking
    Permission.PARKING_VIEW,
    Permission.PARKING_MANAGE,
    
    // View notifications
    Permission.NOTIFICATION_VIEW,
  ],
};

/**
 * Check if a role has a specific permission
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions.includes(permission);
}

/**
 * Check if a role has all of the specified permissions
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(role, permission));
}

/**
 * Check if a role has any of the specified permissions
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(role, permission));
}

/**
 * Middleware to require specific permissions
 */
export function requirePermissions(...permissions: Permission[]) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      throw new APIError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const userRole = request.user.role as UserRole;
    
    if (!hasAllPermissions(userRole, permissions)) {
      throw new APIError(
        'Insufficient permissions',
        403,
        'FORBIDDEN',
        {
          required: permissions,
          userRole,
        }
      );
    }
  };
}

/**
 * Middleware to require any of the specified permissions
 */
export function requireAnyPermission(...permissions: Permission[]) {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      throw new APIError('Authentication required', 401, 'UNAUTHORIZED');
    }

    const userRole = request.user.role as UserRole;
    
    if (!hasAnyPermission(userRole, permissions)) {
      throw new APIError(
        'Insufficient permissions',
        403,
        'FORBIDDEN',
        {
          required: permissions,
          userRole,
        }
      );
    }
  };
}

/**
 * Middleware to check if user is admin
 */
export function requireAdmin() {
  return async (request: FastifyRequest, _reply: FastifyReply): Promise<void> => {
    if (!request.user) {
      throw new APIError('Authentication required', 401, 'UNAUTHORIZED');
    }

    if (request.user.role !== 'ADMIN') {
      throw new APIError(
        'Admin access required',
        403,
        'FORBIDDEN'
      );
    }
  };
}

/**
 * Get all permissions for a role
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return ROLE_PERMISSIONS[role] || [];
}

