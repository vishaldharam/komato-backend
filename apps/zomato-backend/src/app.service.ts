import { LoggerService } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private loggerSerive: LoggerService){}
  getHealthCheck(): string {
    this.loggerSerive.log("HEALTH CHECKED!")
    return 'Health is great!';
  }
}
