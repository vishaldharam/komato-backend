import { Body, Controller, Post } from '@nestjs/common';
import { AuthType } from 'apps/auth/src/shared/decorators/auth-type.decorator';
import { OnboardingService } from './onboarding.service';
import { RestaurantOwnerId } from 'libs/shared/restaurant.owner.id.decorator';
import { CreateRestaurantDto } from '../restaurant.data.dto';

@AuthType('RESTAURANT_OWNER')
@Controller('onboarding')
export class OnboardingController {
  constructor(private onboardingService: OnboardingService) {}

  @Post('/basic-onboarding')
  async setOnboardingDetails(@RestaurantOwnerId() ownerId: string, @Body() basicOnboardingData: CreateRestaurantDto) {
    return this.onboardingService.setBasicOnboarding(ownerId, basicOnboardingData)
  }


}
