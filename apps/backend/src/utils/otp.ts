import { redisClient } from '../config/redis.js';

export type OTPPurpose = 'VERIFICATION' | 'PASSWORD_RESET' | 'TWO_FACTOR_AUTH';

export const otpUtils = {
  /**
   * Generate a 6-digit OTP
   */
  generate(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  },

  /**
   * Store OTP in Redis with 5-minute TTL
   */
  async store(
    identifier: string, // email or phone
    otp: string,
    purpose: OTPPurpose
  ): Promise<void> {
    const key = `otp:${purpose}:${identifier}`;
    await redisClient.setEx(key, 300, otp); // 5 minutes TTL
  },

  /**
   * Verify OTP
   */
  async verify(
    identifier: string,
    otp: string,
    purpose: OTPPurpose
  ): Promise<boolean> {
    const key = `otp:${purpose}:${identifier}`;
    const storedOtp = await redisClient.get(key);

    if (!storedOtp) {
      return false;
    }

    if (storedOtp === otp) {
      // Delete OTP after successful verification
      await redisClient.del(key);
      return true;
    }

    return false;
  },

  /**
   * Delete OTP
   */
  async delete(identifier: string, purpose: OTPPurpose): Promise<void> {
    const key = `otp:${purpose}:${identifier}`;
    await redisClient.del(key);
  },

  /**
   * Check if OTP exists
   */
  async exists(identifier: string, purpose: OTPPurpose): Promise<boolean> {
    const key = `otp:${purpose}:${identifier}`;
    const exists = await redisClient.exists(key);
    return exists === 1;
  },

  /**
   * Get remaining TTL for OTP
   */
  async getTTL(identifier: string, purpose: OTPPurpose): Promise<number> {
    const key = `otp:${purpose}:${identifier}`;
    return await redisClient.ttl(key);
  },
};

