import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '@app/prisma';
import { LoggerModule } from '@app/common';
import { ConfigModule } from '@nestjs/config';
import { OtpModule } from 'apps/auth/src/otp/otp.module';
import { APP_GUARD } from '@nestjs/core';
import { GlobalJwtAuthGuard } from 'apps/auth/src/global.jwt.auth.guard';
import { JwtStrategy } from 'apps/auth/src/jwt.strategy';
import { ProfileModule } from './profile/profile.module';
import { PreferencesModule } from './preferences/preferences.module';
import { GCPModule } from './gcp/gcp.module';
import { AwsModule } from './aws/aws.module';

@Module({
  imports: [
    PrismaModule,
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    OtpModule,
    ProfileModule,
    PreferencesModule,
    GCPModule,
    AwsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GlobalJwtAuthGuard,
    },
    JwtStrategy,
  ],
})
export class AppModule {}
