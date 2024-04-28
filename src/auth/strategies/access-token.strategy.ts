import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../../user/user.service';
import { UnauthorizedException } from '@nestjs/common';


@Injectable()
export class AccessTokenStrategy extends PassportStrategy( Strategy, 'jwt-auth') {
  constructor(
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(payload: any) {
    console.log('payload', payload);
    console.log('payload.sub', payload.sub);
    const user = await this.userService.findDomain(payload.sub);
    if(!user) {
      throw new UnauthorizedException('AUTH::INVALID_TOKEN_OR_TOKEN_EXPIRE');
    }
    return user;
  }
}
