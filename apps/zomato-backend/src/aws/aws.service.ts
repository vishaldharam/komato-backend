import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { LoggerService } from '@app/common';

@Injectable()
export class AwsService {
  private readonly s3: S3Client;

  constructor(private loggerService: LoggerService) {
    this.s3 = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
  }

  async getPresignedUploadUrl(
    bucket: string,
    key: string,
    contentType: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      const command: PutObjectCommandInput = {
        Bucket: bucket,
        Key: key,
        ContentType: contentType,
      };

      const signedUrl = await getSignedUrl(
        this.s3,
        new PutObjectCommand(command),
        { expiresIn },
      );

      return signedUrl;
    } catch (error) {
      this.loggerService.error(error, 'AWS_SERVICE');
      throw error;
    }
  }


  async getPresignedReadUrl(
    bucket: string,
    key: string,
    expiresIn = 3600,
  ): Promise<string> {
    try {
      const command = new GetObjectCommand({
        Bucket: bucket,
        Key: key,
      });

      return await getSignedUrl(this.s3, command, { expiresIn });
    } catch (error) {
      this.loggerService.error(error, 'AWS_SERVICE');
      throw error;
    }
  }
}
