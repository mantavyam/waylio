export enum NotificationType {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  PUSH = 'PUSH',
}

export enum NotificationTemplate {
  USER_CREDENTIALS = 'USER_CREDENTIALS',
  WELCOME_EMAIL = 'WELCOME_EMAIL',
  PASSWORD_RESET = 'PASSWORD_RESET',
  TWO_FACTOR_AUTH = 'TWO_FACTOR_AUTH',
  OTP_VERIFICATION = 'OTP_VERIFICATION',
  APPOINTMENT_CONFIRMATION = 'APPOINTMENT_CONFIRMATION',
  APPOINTMENT_REMINDER = 'APPOINTMENT_REMINDER',
  QUEUE_UPDATE = 'QUEUE_UPDATE',
  PRESCRIPTION_READY = 'PRESCRIPTION_READY',
  PARKING_CONFIRMATION = 'PARKING_CONFIRMATION',
}

export enum NotificationStatus {
  PENDING = 'PENDING',
  SENT = 'SENT',
  FAILED = 'FAILED',
  DELIVERED = 'DELIVERED',
}

export interface NotificationTemplateData {
  id: string;
  name: NotificationTemplate;
  type: NotificationType;
  subject?: string; // For email
  body: string; // Template with placeholders like {{name}}, {{otp}}
  createdAt: Date;
  updatedAt: Date;
}

export interface SendNotificationRequest {
  type: NotificationType;
  template: NotificationTemplate;
  recipient: {
    email?: string;
    phone?: string;
    fcmToken?: string;
  };
  data: Record<string, string | number>; // Template variables
  priority?: 'high' | 'normal' | 'low';
}

export interface SendNotificationResponse {
  id: string;
  status: NotificationStatus;
  sentAt?: Date;
  error?: string;
}

export interface NotificationLog {
  id: string;
  type: NotificationType;
  template: NotificationTemplate;
  recipientEmail?: string;
  recipientPhone?: string;
  status: NotificationStatus;
  sentAt?: Date;
  deliveredAt?: Date;
  error?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

export interface OTPRequest {
  phone?: string;
  email?: string;
  purpose: 'VERIFICATION' | 'PASSWORD_RESET' | 'TWO_FACTOR_AUTH';
}

export interface OTPVerifyRequest {
  phone?: string;
  email?: string;
  otp: string;
  purpose: 'VERIFICATION' | 'PASSWORD_RESET' | 'TWO_FACTOR_AUTH';
}

export interface OTPResponse {
  success: boolean;
  message: string;
  expiresAt?: Date;
}

