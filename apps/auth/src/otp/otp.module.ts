import { Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { LoggerModule } from '@app/common';
import { RedisModule } from '@app/redis';

@Module({
  imports: [LoggerModule, RedisModule],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
