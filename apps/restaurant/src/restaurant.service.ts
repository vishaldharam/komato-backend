import { LoggerService } from '@app/common/logger/logger.service';
import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RestaurantService {
  constructor(
    private prismaService: PrismaService,
    private loggerService: LoggerService,
  ) {}
  private readonly service_name = 'RESTAURANT_SERVICE';
  healthCheck(): string {
    return 'RESTAURANT_SERVICE FINE!';
  }

  async getAllRestaurants() {
    try {
      const restaurant = await this.prismaService.restaurant.findMany({
        include: {
          RestaurantDocs: true,
        },
      });
      return restaurant;
    } catch (error) {
      this.loggerService.error(error, this.service_name);
      throw error;
    }
  }
}
