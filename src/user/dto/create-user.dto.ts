import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  hns_domain: string;

  @IsString()
  code: string;

  @IsString()
  publicKey: string;
}
