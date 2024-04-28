import { IsString } from 'class-validator';

export class UploadIpfsDto {
  @IsString()
  hns_domain: string;

  @IsString()
  encryptMessage: string;
}
