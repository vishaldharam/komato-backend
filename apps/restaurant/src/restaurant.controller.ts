import { Controller, Get } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { AuthType } from 'apps/auth/src/shared/decorators/auth-type.decorator';

@AuthType('ADMIN')
@Controller()
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get('/health-check')
  healthCheck(): string {
    return this.restaurantService.healthCheck();
  }

  @Get('/all-resturants')
  getAllRestaurant() {
    return this.restaurantService.getAllRestaurants();
  }
}
