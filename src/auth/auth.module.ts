import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { AuthenticationService } from './authentication.service';

import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { JwtService } from '@nestjs/jwt';
import { LocalStrategy } from './strategies';
import { AccessTokenStrategy } from './strategies';

@Module({
  imports: [HttpModule, UserModule],
  providers: [
    AuthenticationService,
    JwtService,
    LocalStrategy,
    AccessTokenStrategy,
  ],
  controllers: [AuthController],
  exports: [AuthenticationService],
})
export class AuthModule {}
