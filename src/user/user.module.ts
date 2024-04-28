import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IpfsModule } from '../ipfs/ipfs.module';
import { DomainTransferModule } from '../domain_transfer/domain_transfer.module';
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    DomainTransferModule,
    IpfsModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
