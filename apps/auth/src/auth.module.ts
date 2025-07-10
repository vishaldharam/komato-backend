import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '@app/prisma';
import { EmailService } from './email/email.service';
import { LoggerModule } from '@app/common';
import { RedisModule } from '@app/redis';
import { OtpModule } from './otp/otp.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PrismaModule,
    LoggerModule,
    RedisModule,
    OtpModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, JwtStrategy],
  exports: [JwtStrategy],
})
export class AuthModule {}
