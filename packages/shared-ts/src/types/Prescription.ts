export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  patientId: string;
  doctorId: string;
  medicines: Medicine[];
  diagnosis?: string;
  notes?: string;
  issuedAt: Date;
  digitalSignature?: string;
}

export interface PrescriptionCreateRequest {
  appointmentId: string;
  medicines: Omit<Medicine, 'id'>[];
  diagnosis?: string;
  notes?: string;
}
