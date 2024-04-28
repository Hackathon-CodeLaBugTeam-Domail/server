import { IsString } from 'class-validator';

export class SavePublicKey {
  @IsString()
  hns_domain: string;

  @IsString()
  publicKey: string;
}
