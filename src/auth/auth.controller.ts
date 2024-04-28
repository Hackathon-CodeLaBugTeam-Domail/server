import { Controller, Get, Post, Query, Body, UseGuards } from '@nestjs/common';

import { AuthenticationService } from './authentication.service';
import { AddDomain, VerifyDomain } from './dto';
import { LocalAuthGuard } from './guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('add-domain')
  async addDomain(@Body() addDomain: AddDomain) {
    return this.authenticationService.addDomain(addDomain);
  }

  @Post('verify-domain')
  async verifyDomain(@Body() verifyDomain: VerifyDomain) {
    return this.authenticationService.verifyDomain(verifyDomain);
  }
  @Get('txt-DNS')
  async getTxtRecordDNS(@Query('domain') domain: string) {
    return await this.authenticationService.findTxtRecordDNS(domain);
  }

  @Get('txt-HNS')
  async getTxtRecordHNS(@Query('domain') domain: string) {
    return await this.authenticationService.findTxtRecordHNS(domain);
  }
}
