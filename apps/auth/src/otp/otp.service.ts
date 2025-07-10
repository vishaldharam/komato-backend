import { LoggerService } from '@app/common';
import { RedisService } from '@app/redis';
import { Injectable } from '@nestjs/common';

@Injectable()
export class OtpService {
  constructor(
    private loggerService: LoggerService,
    private redisService: RedisService,
  ) {}

  async generate(email: string, isRetry = false): Promise<string> {
    try {
      const redis = this.redisService.getClient();

      if (isRetry) {
        await redis.del(`otp:${email}`); // 🔥 Delete previous OTP
      }

      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      await redis.set(`otp:${email}`, otp, 'EX', 300); // 5 min TTL

      this.loggerService.log(`OTP generated for ${email}`);
      return otp;
    } catch (error) {
      this.loggerService.error(error, 'OTP_SERVICE');
      throw error;
    }
  }

  async verifyOTP(email: string, inputOtp: string): Promise<boolean> {
    try {
      const redis = this.redisService.getClient();
      const storedOtp = await redis.get(`otp:${email}`);

      const isValid = storedOtp === inputOtp;
      if (isValid) {
        await redis.del(`otp:${email}`); // Remove OTP after success
      }

      return isValid;
    } catch (error) {
      this.loggerService.error(error, 'OTP_SERVICE');
      return false;
    }
  }
}
