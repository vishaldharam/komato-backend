import { IsBoolean, IsEmail, IsOptional, IsString, Matches } from 'class-validator';

export class RequestOtpDto {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsOptional()
  @IsBoolean({ message: 'isRetry must be a boolean value' })
  isRetry?: boolean;
}

export class VerifyOTPDTO {
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @IsString()
  @Matches(/^\d{6}$/, {
    message: 'OTP must be a 6-digit number',
  })
  otp: string;
}
