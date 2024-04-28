import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../user/entities';
import { promisify } from 'util';
import { CreateUserDto } from '../user/dto';
import * as dns from 'dns';
import { AddDomain } from './dto';
import { VerifyDomain } from './dto';

const resolveTxtAsync = promisify(dns.resolveTxt);

@Injectable()
export class AuthenticationService {
  private resolver: dns.Resolver;

  constructor(
    private readonly userService: UserService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {
    this.resolver = new dns.Resolver();
    this.resolver.setServers(['45.90.28.0', '45.90.30.0']);
  }

  async findTxtRecordDNS(domain: string): Promise<string[]> {
    try {
      const records = await resolveTxtAsync(domain);
      return records.map((record) => record.join(''));
    } catch (error) {
      throw new HttpException(
        `DNS query failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findTxtRecordHNS(domain: string): Promise<string[]> {
    try {
      const records = await resolveTxtAsync(domain);
      return records.map((record: string[]) => record.join(''));
    } catch (error) {
      throw new HttpException(
        `DNS query failed: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async addDomain(addDomain: AddDomain) {
    try {
      const { hns_domain, code } = addDomain;
      const isUserExist = await this.userService.findDomain(hns_domain);
      if (isUserExist) {
        const checkMachineId = await this.userService.compare(
          code,
          isUserExist,
        );
        if (checkMachineId) {
          return this.login(isUserExist);
        } else {
          return {
            data: { code },
            message: 'You are currently logged in on another device',
          };
        }
      }
      return {
        data: { code },
        message: 'Please verify your domain',
      };
    } catch (error) {
      throw new HttpException(
        'Error during the domain verification process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async login(user: UserEntity) {
    try {
      const payload = { sub: user.hns_domain };
      const hns_domain = user.hns_domain;
      const accessToken = this.jwtService.sign(
        { ...payload },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '1d',
        },
      );
      const refreshToken = this.jwtService.sign(
        { ...payload },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: '7d',
        },
      );

      return {
        data: { hns_domain, accessToken, refreshToken },
        message: 'Successfully logged in',
      };
    } catch (error) {
      throw new HttpException(
        'Error during the login process',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verifyDomain(verifyDomain: VerifyDomain) {
    const { hns_domain, code, publicKey } = verifyDomain;
    const records = await this.findTxtRecordDNS(hns_domain);
    const isMachineIdFound = records.some((record) => record.includes(code));
    if (isMachineIdFound) {
      const isUser = await this.userService.findDomain(hns_domain);
      if (!isUser) {
        const createUserData: CreateUserDto = {
          hns_domain,
          code,
          publicKey,
        };
        const user = await this.userService.create(createUserData);
        return this.login(user);
      } else {
        const user = await this.userService.findDomain(hns_domain);
        user.code = code;
        await this.userService.save(user);
        return this.login(user);
      }
    } else {
      throw new HttpException(
        'CODE NOT FOUND IN DNS RECORDS',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

