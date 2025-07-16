import { RestaurantOnboardingStatus } from '@prisma/client';
import { IsString, IsOptional, IsLatitude, IsLongitude, IsBoolean, IsEnum } from 'class-validator';

export class CreateRestaurantDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsString()
  address: string;

  @IsLatitude()
  latitude: number;

  @IsLongitude()
  longitude: number;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  logoID?: string;

  @IsString()
  gstNo: string;

  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @IsOptional()
  @IsEnum(RestaurantOnboardingStatus)
  onboardingStatus?: RestaurantOnboardingStatus;

   @IsOptional()
  @IsBoolean()
  onboardingComplete?: boolean;

  @IsOptional()
  @IsBoolean()
  isBlocked?: boolean;

  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  email?: string;
}
