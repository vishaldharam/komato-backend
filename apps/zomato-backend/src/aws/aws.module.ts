import { Module } from '@nestjs/common';
import { AwsService } from './aws.service';
import { LoggerModule } from '@app/common';

@Module({
  imports: [LoggerModule],
  providers: [AwsService],
  exports: [AwsService], // 👈 so other modules can use it
})
export class AwsModule {}
