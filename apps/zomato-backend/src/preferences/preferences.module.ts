import { Module } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { PreferencesController } from './preferences.controller';
import { LoggerModule } from '@app/common';

@Module({
  imports: [LoggerModule],
  providers: [PreferencesService],
  controllers: [PreferencesController]
})
export class PreferencesModule {}
