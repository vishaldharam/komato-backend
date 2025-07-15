import { LoggerService } from '@app/common';
import { PrismaService } from '@app/prisma';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ProfileDto } from './profile.dto';
import { GCPService } from '../gcp/gcp.service';
import { AwsService } from '../aws/aws.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProfileService {
  constructor(
    private readonly prismaService: PrismaService,
    private loggerService: LoggerService,
    private gcpService: GCPService,
    private awsService: AwsService,
  ) {}

  private readonly service_name = 'PROFILE_SERVICE';

  async getProfile(userId: string): Promise<any> {
    try {
      const userInfo = await this.prismaService.userProfile.findUnique({
        where: {
          userId,
        },
      });

      console.log('userId', userInfo);
      return userInfo;
    } catch (error) {
      this.loggerService.error(error, 'PROFILE_SERVICE');
      throw error;
    }
  }

  async setProfile(userId: any, profileData: ProfileDto) {
    try {
      const profile = await this.prismaService.userProfile.upsert({
        where: {
          userId,
        },
        update: {
          ...profileData,
        },
        create: {
          ...profileData,
          userId,
        },
      });

      return profile;
    } catch (error) {
      // Log or throw meaningful error
      this.loggerService.error(error, this.service_name);
      throw new Error('Failed to set profile: ' + error.message);
    }
  }

  async setAddress(userId: any, addressData: any) {
    try {
      let updatedAddrData = addressData || {};
      const { latitude, longitude } =
        await this.gcpService.getLongitudeAndLatitude({
          address: addressData.address || '',
          state: addressData.state || '',
          district: addressData.district || '',
          city: addressData.city || '',
          pincode: addressData.pincode || '',
        });

      if (!latitude || !longitude) {
        throw new NotFoundException(' LONGITUDE and LATITUDE not found!');
      }
      updatedAddrData.latitude = latitude;
      updatedAddrData.longitude = longitude;
      const address = await this.prismaService.userAddresses.create({
        data: {
          ...updatedAddrData,
          userId,
        },
      });

      return address;
    } catch (error) {
      // Log or throw meaningful error
      this.loggerService.error(error, this.service_name);
      throw new Error('Failed to set address: ' + error.message);
    }
  }

  async uploadUserAvatar(userId: string, file: any) {
    try {
      const key = `profile/${uuidv4()}-${file.originalname}`;
      const bucket =
        process.env.AWS_S3_BUCKET_USER_PROFILE_IMAGE || 's3_user_profile';
      const contentType = file.mimetype;

      const signedUrl = await this.awsService.getPresignedUploadUrl(
        bucket,
        key,
        contentType,
      );

      if (!signedUrl) {
        this.loggerService.debug('Signed URL not found!');
        throw new NotFoundException('Signed URL not found!');
      }

      // Save `key` and `signedUrl` to user's profile in DB
      await this.prismaService.userProfile.update({
        where: {
          userId: userId,
        },
        data: {
          imgID: key,
          imgSrcURL: signedUrl,
        },
      });

      return {
        signedUrl,
        key,
        contentType,
      };
    } catch (error) {
      this.loggerService.error(error, this.service_name);
      throw error;
    }
  }

  async getProfileImage(userId: any) {
    try {
      const bucket = process.env.AWS_S3_BUCKET_USER_PROFILE_IMAGE!;
      const profile = await this.prismaService.userProfile.findUnique({
        where: { userId },
      });

      if (!profile?.imgID) {
        return { message: 'No image found for this user' };
      }

      const signedReadUrl = await this.awsService.getPresignedReadUrl(
        bucket,
        profile.imgID,
      );

      return {
        url: signedReadUrl,
      };
    } catch (error) {
      this.loggerService.error(error, this.service_name);
      throw error;
    }
  }
}
