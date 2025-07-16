import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { OnboardingModule } from './onboarding/onboarding.module';
import { PrismaModule } from '@app/prisma';
import { LoggerModule } from '@app/common/logger/logger.module';
import { ConfigModule } from '@nestjs/config';
import { GCPModule } from 'apps/zomato-backend/src/gcp/gcp.module';
import { AwsModule } from 'apps/zomato-backend/src/aws/aws.module';
import { APP_GUARD } from '@nestjs/core';
import { GlobalJwtAuthGuard } from 'apps/auth/src/global.jwt.auth.guard';
import { JwtStrategy } from 'apps/auth/src/jwt.strategy';

@Module({
  imports: [
    OnboardingModule,
    PrismaModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    GCPModule,
    AwsModule,
  ],
  controllers: [RestaurantController],
  providers: [
    RestaurantService,
    {
      provide: APP_GUARD,
      useClass: GlobalJwtAuthGuard,
    },
    JwtStrategy,
  ],
})
export class RestaurantModule {}
