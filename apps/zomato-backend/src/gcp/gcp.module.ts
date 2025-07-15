import { Module } from '@nestjs/common';
import { GCPService } from './gcp.service';
import { LoggerModule } from '@app/common';

@Module({
  imports: [LoggerModule],
  providers: [GCPService],
  exports: [GCPService],
})
export class GCPModule {}
