export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CHECKED_IN = 'CHECKED_IN',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  scheduledTime: Date;
  status: AppointmentStatus;
  queuePosition?: number;
  checkInTime?: Date;
  consultationStartTime?: Date;
  consultationEndTime?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentBookingRequest {
  doctorId: string;
  scheduledTime: Date;
  notes?: string;
}
