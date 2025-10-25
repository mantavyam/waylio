import { UserRole } from './User.js';

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole; // Defaults to PATIENT
}

export interface LoginRequest {
  identifier: string; // Email, phone, or uniqueId
  password: string;
  role?: UserRole; // For role-based login
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    uniqueId?: string;
    requiresPasswordChange?: boolean;
    requires2FA?: boolean;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email?: string;
  phone?: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  resetToken?: string; // For development/testing
}

export interface ResetPasswordRequest {
  resetToken: string;
  newPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface VerifyOTPRequest {
  phone?: string;
  email?: string;
  otp: string;
}

export interface VerifyOTPResponse {
  success: boolean;
  message: string;
  token?: string; // If OTP is for login/registration
}

export interface GetCurrentUserResponse {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  uniqueId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export interface Setup2FARequest {
  userId: string;
  method: '2FA_SMS' | '2FA_EMAIL' | '2FA_APP';
}

export interface Setup2FAResponse {
  success: boolean;
  secret?: string; // For authenticator app
  qrCode?: string; // For authenticator app
  message: string;
}

export interface Verify2FARequest {
  userId: string;
  code: string;
}

export interface Verify2FAResponse {
  success: boolean;
  message: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
  uniqueId?: string;
  iat?: number;
  exp?: number;
}

