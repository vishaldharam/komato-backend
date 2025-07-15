import { IsOptional, IsString, IsUUID, IsDateString, IsPhoneNumber } from 'class-validator';

export class ProfileDto {

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  imgSrcURL?: string;

  @IsOptional()
  @IsString()
  imgID?: string;

  @IsOptional()
  @IsPhoneNumber('IN')
  phone?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

}
