import { forwardRef, Module } from '@nestjs/common';
import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';
import { DomainTransferModule } from '../domain_transfer/domain_transfer.module';
import { UserModule } from '../user/user.module';
import { IpfsModule } from '../ipfs/ipfs.module';

@Module({
  imports: [
    forwardRef(() => DomainTransferModule),
    forwardRef(() => UserModule),
    forwardRef(() => IpfsModule),
  ],
  controllers: [BackupController],
  providers: [BackupService],
})
export class BackupModule {}
