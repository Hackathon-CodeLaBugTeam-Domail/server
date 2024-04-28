import { IsString } from 'class-validator';

export class GetPublicKeyDto {
  @IsString()
  hns_domain: string;
}
