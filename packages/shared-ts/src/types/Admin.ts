export enum AuditAction {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  PASSWORD_RESET = 'PASSWORD_RESET',
  ACTIVATE = 'ACTIVATE',
  DEACTIVATE = 'DEACTIVATE',
  BULK_IMPORT = 'BULK_IMPORT',
}

export enum ResourceType {
  USER = 'USER',
  DOCTOR = 'DOCTOR',
  STAFF = 'STAFF',
  PATIENT = 'PATIENT',
  HOSPITAL = 'HOSPITAL',
  DEPARTMENT = 'DEPARTMENT',
  APPOINTMENT = 'APPOINTMENT',
  PRESCRIPTION = 'PRESCRIPTION',
  PARKING = 'PARKING',
}

export interface AuditLog {
  id: string;
  userId: string;
  action: AuditAction;
  resourceType: ResourceType;
  resourceId: string;
  changes?: Record<string, any>; // Before/after values
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface CreateAuditLogRequest {
  userId: string;
  action: AuditAction;
  resourceType: ResourceType;
  resourceId: string;
  changes?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface AuditLogFilters {
  userId?: string;
  action?: AuditAction;
  resourceType?: ResourceType;
  resourceId?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface AuditLogListResponse {
  logs: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Permission {
  resource: ResourceType;
  actions: AuditAction[];
}

export interface RolePermissions {
  ADMIN: Permission[];
  DOCTOR: Permission[];
  RECEPTION: Permission[];
  PATIENT: Permission[];
}

export interface DashboardStats {
  totalPatients: number;
  totalDoctors: number;
  totalStaff: number;
  totalAppointments: number;
  todayAppointments: number;
  activeParking: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export interface PasswordResetRequest {
  userId: string;
  newPassword?: string; // If not provided, generate temporary password
}

export interface PasswordResetResponse {
  success: boolean;
  temporaryPassword?: string;
  message: string;
}

export interface FirstTimeLoginRequest {
  uniqueId: string;
  temporaryPassword: string;
  newPassword: string;
}

export interface FirstTimeLoginResponse {
  success: boolean;
  requiresPasswordChange: boolean;
  message: string;
}

