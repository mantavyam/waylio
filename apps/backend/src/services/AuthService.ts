import { PrismaClient, UserRole } from '@prisma/client';
import { APIError } from '../utils/APIError.js';
import { BaseService } from './BaseService.js';
import { passwordUtils } from '../utils/password.js';
import { jwtUtils } from '../utils/jwt.js';

export interface RegisterInput {
  email: string;
  phone: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
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
    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
      select: {
        id: true,
        email: true,
        phone: true,
        password_hash: true,
        first_name: true,
        last_name: true,
        role: true,
      },
    });

    if (!user) {
      throw new APIError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Verify password
    const isValidPassword = await passwordUtils.compare(
      input.password,
      user.password_hash
    );

    if (!isValidPassword) {
      throw new APIError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    // Generate tokens
    const tokens = jwtUtils.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
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
        created_at: true,
        patient_profile: true,
        doctor_profile: true,
      },
    });

    if (!user) {
      throw new APIError('User not found', 404, 'USER_NOT_FOUND');
    }

    return user;
  }
}

