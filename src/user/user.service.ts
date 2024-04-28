import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto';
import { UserEntity } from './entities';
import { GetPublicKeyDto } from './dto';
import { DeleteUserDto } from './dto';
import { IpfsService } from '../ipfs/ipfs.service';
import { UploadIpfsDto } from './dto';
import { Req } from '@nestjs/common';
import { CreateDomainTransferDto } from '../domain_transfer/dto/create_domain_transfer.dto';
import { Domain_transferService } from '../domain_transfer/domain_transfer.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly domain_transferService: Domain_transferService,
    private readonly ipfsService: IpfsService,
  ) {}
  async uploadFile(@Req() req, uploadIpfsDto: UploadIpfsDto) {
    const fileJson = JSON.stringify(uploadIpfsDto.encryptMessage);
    const cid_hash = await this.ipfsService.uploadFile(fileJson);
    const cid = cid_hash.ipfsHash;
    const hns_domain_send = await this.findDomain(req.user.hns_domain);
    const hn_domain_receive = await this.findDomain(uploadIpfsDto.hns_domain);
    const encryptMessagePrivate = uploadIpfsDto.encryptMessagePrivate;
    if (!hns_domain_send || !hn_domain_receive) {
      throw new NotFoundException('User not found');
    }
    const createDomainTransferDto: CreateDomainTransferDto = {
      hns_domain_send: hns_domain_send,
      hns_domain_receive: hn_domain_receive,
      cid: cid,
      encryptMessagePrivate: encryptMessagePrivate,
    };
    const domainTransfer = await this.domain_transferService.create(
      createDomainTransferDto,
    );
    return {
      domainTransfer,
      message: 'Send mail success',
    };
  }
  async save(user: UserEntity) {
    const userSave = await this.userRepository.save(user);
    return userSave;
  }

  async create(createUserDto: CreateUserDto) {
    return this.userRepository.save(
      this.userRepository.create(createUserDto as unknown as UserEntity),
    );
  }

  async findDomain(hns_domain: string) {
    const user = await this.userRepository.findOne({
      where: { hns_domain: hns_domain },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async getPublicKey(query: GetPublicKeyDto) {
    const user = await this.userRepository.findOne({
      where: { hns_domain: query.hns_domain },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      publicKey: user.publicKey,
    };
  }

  async compare(code: string, user: UserEntity) {
    if (code === user.code) {
      return true;
    }
    return false;
  }

  async generateHash(data: string) {
    const hash = (data: string) =>
      crypto.createHash('sha256').update(data).digest('hex');
    return hash(data);
  }
  async delete(deleteUserDto: DeleteUserDto) {
    const user = await this.userRepository.findOne({
      where: { hns_domain: deleteUserDto.hns_domain },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.userRepository.remove(user);
  }
  async getAll() {
    return this.userRepository.find();
  }
}
