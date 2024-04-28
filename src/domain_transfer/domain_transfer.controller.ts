import { Controller, UseGuards, Get, Req } from '@nestjs/common';
import { Domain_transferService } from './domain_transfer.service';
import { AccessTokenGuard } from '../auth/guards';

@Controller('domain-transfer')
export class DomainTransferController {
  constructor(private readonly domainTransferService: Domain_transferService) {}
  @Get('user-send')
  @UseGuards(AccessTokenGuard)
  async getUserSend(@Req() req) {
    return this.domainTransferService.userSend(req);
  }

  @Get('user/receive')
  @UseGuards(AccessTokenGuard)
  async getUserReceive(@Req() req) {
    return this.domainTransferService.userReceive(req);
  }

  @Get('all/user/mail')
  async getAll() {
    return this.domainTransferService.findAll();
  }

  @Get('all/user/mail/backup')
  @UseGuards(AccessTokenGuard)
  async getBackup(@Req() req) {
    return this.domainTransferService.findAllMessage(req);
  }
}
