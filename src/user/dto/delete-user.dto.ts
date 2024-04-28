import { IsString } from 'class-validator';

export class DeleteUserDto {
  @IsString()
  hns_domain: string;
}
