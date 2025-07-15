import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { LoggerModule } from '@app/common';
import { GCPModule } from '../gcp/gcp.module';
import { AwsModule } from '../aws/aws.module';

@Module({
  imports: [LoggerModule, GCPModule, AwsModule],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
