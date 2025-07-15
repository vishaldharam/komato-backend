import { LoggerService } from '@app/common';
import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PreferencesService {
  constructor(
    private readonly prismaService: PrismaService,
    private loggerService: LoggerService,
  ) {}

  private readonly service_name = 'PREFERENCE_SERVICE';

  async setPreferences(userId: string, preferenceData) {
    try {
      const preferences = await this.prismaService.userPreferences.upsert({
        where: {
          userId,
        },
        update: {
          ...preferenceData,
        },
        create: {
          ...preferenceData,
          userId,
        },
      });

      return preferences;
    } catch (error) {
      // Log or throw meaningful error
      this.loggerService.error(error, this.service_name);
      throw new Error('Failed to set preferences: ' + error.message);
    }
  }

  async getPreferences(userId: string) {
    try {
      const userPreferences =
        await this.prismaService.userPreferences.findUnique({
          where: {
            userId,
          },
        });
      return userPreferences || {};
    } catch (error) {
      this.loggerService.error(error, this.service_name);
      throw error;
    }
  }
}
