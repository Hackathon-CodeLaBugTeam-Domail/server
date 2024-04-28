import { Injectable, forwardRef, Inject, Req } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DomainTransferEntity } from './entities/domain_transfer.entity';
import { CreateDomainTransferDto } from './dto/create_domain_transfer.dto';
import { UserService } from '../user/user.service';
import { IpfsService } from '../ipfs/ipfs.service';

@Injectable()
export class Domain_transferService {
  constructor(
    @InjectRepository(DomainTransferEntity)
    private readonly domainTransferEntityRepository: Repository<DomainTransferEntity>,
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private readonly ipfsService: IpfsService,
  ) {}

  async create(createDomainTransferDto: CreateDomainTransferDto) {
    return this.domainTransferEntityRepository.save(
      this.domainTransferEntityRepository.create(
        createDomainTransferDto as unknown as DomainTransferEntity,
      ),
    );
  }

  async userSend(@Req() req) {
    const hns_domain = req.user.hns_domain;
    const user = await this.userService.findDomain(hns_domain);
    const domainTransfers = await this.domainTransferEntityRepository.find({
      where: {
        hns_domain_send: {
          hns_domain: hns_domain,
        },
      },
      relations: ['hns_domain_receive'],
    });
    const data = domainTransfers.map((data) => ({
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      hns_domain: data.hns_domain_receive.hns_domain,
      message: data.encryptMessagePrivate,
    }));
    return {
      data,
      message: 'Successful send email',
    };
  }

  async userReceive(@Req() req) {
    const hns_domain = req.user.hns_domain;
    // Finding user by domain
    const user = await this.userService.findDomain(hns_domain);
    // Finding domain transfers
    const domainTransfers = await this.domainTransferEntityRepository.find({
      where: {
        hns_domain_receive: {
          hns_domain: hns_domain,
        },
      },
      relations: ['hns_domain_send'],
    });
    const mappedData = domainTransfers.map((data) => ({
      cid: data.cid,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      hns_domain: data.hns_domain_send.hns_domain,
      publicKey: data.hns_domain_send.publicKey,
      message: '',
    }));
    await Promise.all(
      mappedData.map(async (data) => {
        const mess = await this.ipfsService.getFile(data.cid);
        data.message = mess;
        console.log('userSend message', mess);
      }),
    );
    const data = mappedData.map((data) => ({
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
      hns_domain: data.hns_domain,
      publicKey: data.publicKey,
      message: data.message,
    }));

    return {
      data,
      message: 'Successful receive email',
    };
  }

  async findAll() {
    return this.domainTransferEntityRepository.find({
      relations: ['hns_domain_receive', 'hns_domain_send'],
    });
  }

  async findAllMessage(@Req() req) {
    const mail_send = await this.userSend(req);
    const mail_receive = await this.userReceive(req);
    const all_mail = {
      mail_send,
      mail_receive,
    };
    const cide_backup = await this.ipfsService.uploadFile(
      JSON.stringify(all_mail),
    );
    return {
      cide_backup,
      message: 'Successful backup',
    };
  }
}
