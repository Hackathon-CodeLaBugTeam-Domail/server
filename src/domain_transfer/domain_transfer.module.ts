import { Module, forwardRef } from '@nestjs/common';
import { Domain_transferService } from './domain_transfer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DomainTransferEntity } from './entities/domain_transfer.entity';
import { UserModule } from '../user/user.module';
import { DomainTransferController } from './domain_transfer.controller';
import { UserService } from '../user/user.service';
import { IpfsModule } from '../ipfs/ipfs.module';

@Module({
  imports: [
    IpfsModule,
    TypeOrmModule.forFeature([DomainTransferEntity]),
    forwardRef(() => UserModule),
  ],
  controllers: [DomainTransferController],
  providers: [Domain_transferService],
  exports: [Domain_transferService],
})
export class DomainTransferModule {}
