import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileDto } from './profile.dto';
import { UserId } from 'libs/shared/decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from '../aws/aws.service';

@Controller('profile')
export class ProfileController {
  constructor(
    private profileService: ProfileService,
    private awsService: AwsService,
  ) {}

  @Get('/')
  async getProfile(@UserId() user): Promise<any> {
    return this.profileService.getProfile(user);
  }

  @Post('/')
  async setProfile(@UserId() user, @Body() body: ProfileDto): Promise<any> {
    return this.profileService.setProfile(user, body);
  }

  @Post('/address')
  async setAddress(@UserId() user, @Body() body: any): Promise<any> {
    return this.profileService.setAddress(user, body);
  }

  @Post('/upload-avatar')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAvatar(
    @UserId() userId,
    @UploadedFile()
    file: any,
  ) {
    return this.profileService.uploadUserAvatar(userId, file);
  }

  @Get('/get-avatar')
  async getAvatar(@UserId() userId) {
    return this.profileService.getProfileImage(userId);
  }
}
