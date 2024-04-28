import { IsString, IsObject } from 'class-validator';
import { UserEntity } from '../../user/entities';

export class CreateDomainTransferDto {
  @IsString()
  cid: string;

  @IsString()
  encryptMessagePrivate: string;

  @IsObject()
  hns_domain_receive: UserEntity;

  @IsObject()
  hns_domain_send: UserEntity;
}
