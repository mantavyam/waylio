import { UserRole } from './User.js';
import { TimeSlot } from './Hospital.js';

export enum StaffRole {
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  TECHNICIAN = 'TECHNICIAN',
  PHARMACIST = 'PHARMACIST',
  ADMIN_STAFF = 'ADMIN_STAFF',
  SECURITY = 'SECURITY',
  MAINTENANCE = 'MAINTENANCE',
}

export interface StaffProfile {
  id: string;
  userId: string;
  uniqueId: string; // Format: HOS-STF-XXXXX
  staffRole: StaffRole;
  departmentId?: string;
  employeeId?: string;
  joiningDate: Date;
  shiftTimings?: ShiftTimings;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShiftTimings {
  monday?: TimeSlot;
  tuesday?: TimeSlot;
  wednesday?: TimeSlot;
  thursday?: TimeSlot;
  friday?: TimeSlot;
  saturday?: TimeSlot;
  sunday?: TimeSlot;
}

export interface DoctorProfileExtended {
  id: string;
  userId: string;
  uniqueId: string; // Format: HOS-DOC-XXXXX
  specialization: string;
  departmentId: string;
  registrationNumber: string;
  qualifications: string[];
  experience: number; // Years
  consultationFee: number;
  followUpFee?: number;
  videoConsultationFee?: number;
  availability: WeeklyAvailability;
  languages: string[];
  bio?: string;
  certificateUrls?: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeeklyAvailability {
  monday?: DayAvailability;
  tuesday?: DayAvailability;
  wednesday?: DayAvailability;
  thursday?: DayAvailability;
  friday?: DayAvailability;
  saturday?: DayAvailability;
  sunday?: DayAvailability;
}

export interface DayAvailability {
  isAvailable: boolean;
  slots: TimeSlot[];
  slotDuration: number; // Minutes
  breakTimes?: TimeSlot[];
  location?: string; // Room number or location
}

export interface CreateDoctorRequest {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  specialization: string;
  departmentId: string;
  registrationNumber: string;
  qualifications: string[];
  experience: number;
  consultationFee: number;
  followUpFee?: number;
  videoConsultationFee?: number;
  languages: string[];
  bio?: string;
}

export interface CreateStaffRequest {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  staffRole: StaffRole;
  departmentId?: string;
  employeeId?: string;
  joiningDate: Date;
}

export interface UpdateDoctorRequest extends Partial<CreateDoctorRequest> {
  availability?: WeeklyAvailability;
  certificateUrls?: string[];
  isActive?: boolean;
}

export interface UpdateStaffRequest extends Partial<CreateStaffRequest> {
  shiftTimings?: ShiftTimings;
  isActive?: boolean;
}

export interface UserWithProfile {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  uniqueId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  doctorProfile?: DoctorProfileExtended;
  staffProfile?: StaffProfile;
}

export interface UserListFilters {
  role?: UserRole;
  departmentId?: string;
  isActive?: boolean;
  search?: string; // Search by name, email, phone, uniqueId
  page?: number;
  limit?: number;
}

export interface UserListResponse {
  users: UserWithProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface BulkImportRequest {
  users: Array<CreateDoctorRequest | CreateStaffRequest>;
}

export interface BulkImportResponse {
  success: number;
  failed: number;
  errors: Array<{
    row: number;
    error: string;
  }>;
}

export interface CredentialsResponse {
  uniqueId: string;
  temporaryPassword: string;
  email: string;
  phone: string;
}

