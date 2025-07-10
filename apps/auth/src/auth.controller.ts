import {
  Body,
  Controller,
  Get,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestOtpDto, VerifyOTPDTO } from './dto/request.email.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/request-email-otp')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  requestEmailOTP(@Body() body: RequestOtpDto): Promise<any> {
    return this.authService.getRequestEmailOTP(body);
  }

  @Post('/verify-otp')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  verifyOTP(@Body() otpData: VerifyOTPDTO): Promise<any> {
    return this.authService.verifyOTP(otpData);
  }

  @Post('/refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    return this.authService.refreshAccessToken(body.refreshToken);
  }
}
