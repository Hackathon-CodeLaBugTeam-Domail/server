import { Controller } from '@nestjs/common';
import { BackupService } from './backup.service';
import { Get } from '@nestjs/common';

@Controller('backup')
export class BackupController {
  constructor(private readonly backupService: BackupService) {}
  @Get('all/mail')
  async backupDomainTransfer() {
    return this.backupService.backupDomainTransfer();
  }
  @Get('all-user')
  async backupUser() {
    return this.backupService.backupUser();
  }
  @Get('filtered/user/mail')
  async backupFilteredDomainTransfer() {
    return await this.backupService.backupFilteredDomainTransfer();
  }
}
