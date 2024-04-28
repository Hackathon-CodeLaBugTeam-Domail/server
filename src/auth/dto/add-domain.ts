import { IsString } from 'class-validator';

export class AddDomain {
  @IsString()
  hns_domain: string;

  @IsString()
  code: string;
}
