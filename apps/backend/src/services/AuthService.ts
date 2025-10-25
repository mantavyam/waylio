import { PrismaClient, UserRole } from '@prisma/client';
import { APIError } from '../utils/APIError.js';
import { BaseService } from './BaseService.js';
import { passwordUtils } from '../utils/password.js';
import { jwtUtils } from '../utils/jwt.js';
import { otpUtils, OTPPurpose } from '../utils/otp.js';
import { redisClient } from '../config/redis.js';

export interface RegisterInput {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface LoginInput {
  identifier: string; // Email, phone, or uniqueId
  password: string;
  role?: UserRole;
}

export interface SendOTPInput {
  phone?: string;
  email?: string;
  purpose: OTPPurpose;
}

export interface VerifyOTPInput {
  phone?: string;
  email?: string;
  otp: string;
  purpose: OTPPurpose;
}

export interface ForgotPasswordInput {
  email?: string;
  phone?: string;
}

export interface ResetPasswordInput {
  resetToken: string;
  newPassword: string;
}

export interface ChangePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export class AuthService extends BaseService {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async register(input: RegisterInput) {
    // Check if user already exists
    const existingUser = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: input.email },
          { phone: input.phone },
        ],
      },
    });

    if (existingUser) {
      throw new APIError(
        'User with this email or phone already exists',
        400,
        'USER_EXISTS'
      );
    }

    // Hash password
    const passwordHash = await passwordUtils.hash(input.password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        phone: input.phone,
        password_hash: passwordHash,
        first_name: input.firstName,
        last_name: input.lastName,
        role: input.role || 'PATIENT',
      },
      select: {
        id: true,
        email: true,
        phone: true,
        first_name: true,
        last_name: true,
        role: true,
        created_at: true,
      },
    });

    // Create profile based on role
    if (user.role === 'PATIENT') {
      await this.prisma.patientProfile.create({
        data: {
          user_id: user.id,
        },
      });
    }

    // Generate tokens
    const tokens = jwtUtils.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user,
      ...tokens,
    };
  }

  async login(input: LoginInput) {
    // Find user by email, phone, or uniqueId
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: input.identifier },
          { phone: input.identifier },
          { unique_id: input.identifier },
        ],
        ...(input.role && { role: input.role }),
      },
      select: {
        id: true,
        email: true,
        phone: true,
        password_hash: true,
        first_name: true,
        last_name: true,
        role: true,
        unique_id: true,
        is_active: true,
        requires_password_change: true,
      },
    });

    if (!user) {
      throw new APIError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    if (!user.is_active) {
      throw new APIError('Account is deactivated', 403, 'ACCOUNT_DEACTIVATED');
    }

    // Verify password
    const isValidPassword = await passwordUtils.compare(
      input.password,
      user.password_hash
    );

    if (!isValidPassword) {
      throw new APIError('Invalid credentials', 401, 'INVALID_CREDENTIALS');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { last_login: new Date() },
    });

    // Generate tokens
    const tokens = jwtUtils.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
      uniqueId: user.unique_id || undefined,
    });

    // Remove password hash from response
    const { password_hash: _password_hash, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = jwtUtils.verifyRefreshToken(refreshToken);

      // Verify user still exists
      const user = await this.prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          role: true,
        },
      });

      if (!user) {
        throw new APIError('User not found', 404, 'USER_NOT_FOUND');
      }

      // Generate new access token
      const accessToken = jwtUtils.generateAccessToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      });

      return { accessToken };
    } catch {
      throw new APIError('Invalid refresh token', 401, 'INVALID_TOKEN');
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        phone: true,
        first_name: true,
        last_name: true,
        role: true,
        unique_id: true,
        is_active: true,
        requires_password_change: true,
        created_at: true,
        updated_at: true,
        patient_profile: true,
        doctor_profile: true,
        staff_profile: true,
      },
    });

    if (!user) {
      throw new APIError('User not found', 404, 'USER_NOT_FOUND');
    }

    return user;
  }

  async sendOTP(input: SendOTPInput) {
    const identifier = input.email || input.phone;
    if (!identifier) {
      throw new APIError('Email or phone is required', 400, 'MISSING_IDENTIFIER');
    }

    // Generate OTP
    const otp = otpUtils.generate();

    // Store in Redis
    await otpUtils.store(identifier, otp, input.purpose);

    // TODO: Send OTP via SMS/Email using NotificationService
    // For now, return OTP in development mode
    if (process.env.NODE_ENV === 'development') {
      return {
        success: true,
        message: 'OTP sent successfully',
        otp, // Only in development
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      };
    }

    return {
      success: true,
      message: 'OTP sent successfully',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    };
  }

  async verifyOTP(input: VerifyOTPInput) {
    const identifier = input.email || input.phone;
    if (!identifier) {
      throw new APIError('Email or phone is required', 400, 'MISSING_IDENTIFIER');
    }

    const isValid = await otpUtils.verify(identifier, input.otp, input.purpose);

    if (!isValid) {
      throw new APIError('Invalid or expired OTP', 400, 'INVALID_OTP');
    }

    return {
      success: true,
      message: 'OTP verified successfully',
    };
  }

  async forgotPassword(input: ForgotPasswordInput) {
    const identifier = input.email || input.phone;
    if (!identifier) {
      throw new APIError('Email or phone is required', 400, 'MISSING_IDENTIFIER');
    }

    // Find user
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier },
          { phone: identifier },
        ],
      },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return {
        success: true,
        message: 'If an account exists, a password reset link has been sent',
      };
    }

    // Generate OTP for password reset
    const otp = otpUtils.generate();
    await otpUtils.store(identifier, otp, 'PASSWORD_RESET');

    // Generate reset token (store in Redis)
    const resetToken = `${user.id}:${Date.now()}`;
    await redisClient.setEx(`password_reset:${resetToken}`, 3600, user.id); // 1 hour

    // TODO: Send reset link via email/SMS using NotificationService

    if (process.env.NODE_ENV === 'development') {
      return {
        success: true,
        message: 'Password reset OTP sent',
        otp, // Only in development
        resetToken, // Only in development
      };
    }

    return {
      success: true,
      message: 'If an account exists, a password reset link has been sent',
    };
  }

  async resetPassword(input: ResetPasswordInput) {
    // Verify reset token
    const userId = await redisClient.get(`password_reset:${input.resetToken}`);

    if (!userId) {
      throw new APIError('Invalid or expired reset token', 400, 'INVALID_RESET_TOKEN');
    }

    // Hash new password
    const passwordHash = await passwordUtils.hash(input.newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        password_hash: passwordHash,
        requires_password_change: false,
      },
    });

    // Delete reset token
    await redisClient.del(`password_reset:${input.resetToken}`);

    return {
      success: true,
      message: 'Password reset successfully',
    };
  }

  async changePassword(input: ChangePasswordInput) {
    // Get user
    const user = await this.prisma.user.findUnique({
      where: { id: input.userId },
      select: {
        id: true,
        password_hash: true,
      },
    });

    if (!user) {
      throw new APIError('User not found', 404, 'USER_NOT_FOUND');
    }

    // Verify current password
    const isValidPassword = await passwordUtils.compare(
      input.currentPassword,
      user.password_hash
    );

    if (!isValidPassword) {
      throw new APIError('Current password is incorrect', 400, 'INVALID_PASSWORD');
    }

    // Hash new password
    const passwordHash = await passwordUtils.hash(input.newPassword);

    // Update password
    await this.prisma.user.update({
      where: { id: input.userId },
      data: {
        password_hash: passwordHash,
        requires_password_change: false,
      },
    });

    return {
      success: true,
      message: 'Password changed successfully',
    };
  }
}

