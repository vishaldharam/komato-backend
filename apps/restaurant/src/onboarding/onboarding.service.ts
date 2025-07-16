import { LoggerService } from '@app/common';
import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from '../restaurant.data.dto';

@Injectable()
export class OnboardingService {
  constructor(
    private prismaService: PrismaService,
    private loggerService: LoggerService,
  ) {}
  private readonly service_name = 'ONBOARDING_SERVICE';
  async setBasicOnboarding(
    ownerId: string,
    basicOnboardingData: CreateRestaurantDto,
  ) {
    try {
      const restaurant = await this.prismaService.restaurant.create({
        data: {
          ...basicOnboardingData,
          ownerId,
        },
      });

      return restaurant;
    } catch (error) {
      this.loggerService.error(error, this.service_name);
      throw error;
    }
  }
}
