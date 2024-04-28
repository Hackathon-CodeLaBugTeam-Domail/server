import { IsString } from 'class-validator';

export class VerifyDomain {
  @IsString()
  hns_domain: string;

  @IsString()
  code: string;

  @IsString()
  publicKey: string;
}
