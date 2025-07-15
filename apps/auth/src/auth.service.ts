import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { RequestOtpDto, VerifyOTPDTO } from './dto/request.email.dto';
import { LoggerService } from '@app/common';
import { OtpService } from './otp/otp.service';
import { EmailService } from './email/email.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '@app/prisma';
import { RedisService } from '@app/redis';

@Injectable()
export class AuthService {
  constructor(
    private loggerService: LoggerService,
    private otpService: OtpService,
    private emailService: EmailService,
    private readonly prismaService: PrismaService,
    private jwtService: JwtService,
    private redisService: RedisService,
  ) {}
  async getRequestEmailOTP(emailDTO: RequestOtpDto) {
    try {
      const { email, isRetry } = emailDTO;
      const otp = await this.otpService.generate(email, isRetry);
      this.emailService.sendOTP(email, otp);
      return {
        msg: 'OTP sent successfully',
      };
    } catch (error) {
      this.loggerService.error(error, 'AUTH_SERVICE');
      throw error;
    }
  }

  async verifyOTP(verifyOtpDTO: VerifyOTPDTO) {
    try {
      const { email, otp } = verifyOtpDTO;
      const isVerified = await this.otpService.verifyOTP(email, otp);
      if (!isVerified) {
        this.loggerService.log('OTP is invalid!');
        return { isVerified: false, msg: 'Invalid otp!' };
      }

      // Check if user exists
      let user = await this.prismaService.user.findUnique({
        where: { email },
      });

      // If not, create new user
      if (!user) {
        user = await this.prismaService.user.create({
          data: {
            email,
            role: 'CUSTOMER', // default role
          },
        });

        this.loggerService.log(`New user created: ${user.email}`);
      } else {
        this.loggerService.log(`Existing user: ${user.email}`);
      }

      // Generate JWT (you can replace this with your JWT service)
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const accessToken = await this.jwtService.signAsync(payload, {
        expiresIn: '30m',
        secret: process.env.JWT_SECRET,
      });

      const refreshToken = await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH_SECRET,
      });

      await this.redisService.getClient().set(
        `refresh:${user.id}`,
        refreshToken,
        'EX',
        5 * 60, // 7 days in seconds
      );

      return {
        isVerified: true,
        user,
        accessToken,
        refreshToken
      };
    } catch (error) {
      this.loggerService.error(error, 'AUTH_SERVICE');
      throw error;
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      // 1. Decode token (even if expired) to get userId
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const userId = payload.sub;

      // 2. Get refresh token from Redis
      const redisToken = await this.redisService
        .getClient()
        .get(`refresh:${userId}`);

      if (!redisToken || redisToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // 3. Fetch user info from DB
      const user = await this.prismaService.user.findUnique({
        where: { id: userId },
      });
      if (!user || user.isBlocked) {
        throw new ForbiddenException('User is blocked or not found');
      }

      // 4. Generate new tokens
      const newPayload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };

      const newAccessToken = await this.jwtService.signAsync(newPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: '30m',
      });

      const newRefreshToken = await this.jwtService.signAsync(newPayload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: '7d',
      });

      // 5. Store new refresh token in Redis
      await this.redisService.getClient().set(
        `refresh:${user.id}`,
        newRefreshToken,
        'EX',
        5 * 60, // 7 days
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (err) {
      this.loggerService.error(err, 'AUTH_REFRESH');
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
