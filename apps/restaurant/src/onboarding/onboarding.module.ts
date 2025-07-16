import { Module } from '@nestjs/common';
import { OnboardingController } from './onboarding.controller';
import { OnboardingService } from './onboarding.service';
import { LoggerModule } from '@app/common';

@Module({
  imports: [LoggerModule],
  controllers: [OnboardingController],
  providers: [OnboardingService]
})
export class OnboardingModule {}
