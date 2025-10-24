export enum ParkingStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  EXPIRED = 'EXPIRED',
}

export interface ParkingSession {
  id: string;
  userId: string;
  slotId: string;
  entryTime: Date;
  exitTime?: Date;
  duration: number; // in hours
  amount: number;
  paymentId: string;
  status: ParkingStatus;
  qrCode: string;
  createdAt: Date;
}

export interface ParkingSlot {
  id: string;
  slotNumber: string;
  level: string;
  zone: string;
  isOccupied: boolean;
  coordinates?: { lat: number; lng: number };
}
