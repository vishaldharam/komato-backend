import { Body, Controller, Get, Post } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { UserId } from 'libs/shared/decorator';

@Controller('preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Post('/')
  async setPreferences(@UserId() userId: string, @Body() body) {
    return this.preferencesService.setPreferences(userId, body);
  }

  @Get('/')
  async getPreferences(@UserId() userId: string) {
    return this.preferencesService.getPreferences(userId);
  }
}
