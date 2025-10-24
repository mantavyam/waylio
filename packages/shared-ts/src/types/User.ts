export enum UserRole {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  RECEPTION = 'RECEPTION',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface PatientProfile extends User {
  role: UserRole.PATIENT;
  medicalHistory?: string;
  emergencyContact?: string;
}

export interface DoctorProfile extends User {
  role: UserRole.DOCTOR;
  specialization: string;
  department: string;
  consultationFee: number;
  availability?: Record<string, any>; // To be expanded
}
