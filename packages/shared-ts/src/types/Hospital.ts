export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  logoUrl?: string;
  description?: string;
  operatingHours: OperatingHours;
  emergencyContact: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OperatingHours {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isOpen: boolean;
  openTime?: string; // Format: "HH:mm"
  closeTime?: string; // Format: "HH:mm"
  breaks?: TimeSlot[];
}

export interface TimeSlot {
  startTime: string; // Format: "HH:mm"
  endTime: string; // Format: "HH:mm"
}

export interface Holiday {
  id: string;
  hospitalId: string;
  name: string;
  date: Date;
  isRecurring: boolean;
  createdAt: Date;
}

export interface Department {
  id: string;
  hospitalId: string;
  name: string;
  description?: string;
  building: string;
  floor: number;
  wing?: string;
  headDoctorId?: string;
  phone?: string;
  email?: string;
  operatingHours?: OperatingHours;
  services: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateHospitalRequest {
  name: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
  operatingHours: OperatingHours;
  emergencyContact: string;
}

export interface UpdateHospitalRequest extends Partial<CreateHospitalRequest> {
  logoUrl?: string;
}

export interface CreateDepartmentRequest {
  name: string;
  description?: string;
  building: string;
  floor: number;
  wing?: string;
  headDoctorId?: string;
  phone?: string;
  email?: string;
  operatingHours?: OperatingHours;
  services: string[];
}

export interface UpdateDepartmentRequest extends Partial<CreateDepartmentRequest> {
  isActive?: boolean;
}

export interface DepartmentListResponse {
  departments: Department[];
  total: number;
}

