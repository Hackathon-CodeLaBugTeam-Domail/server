import { Injectable } from '@nestjs/common';
import { Domain_transferService } from '../domain_transfer/domain_transfer.service';
import { UserService } from '../user/user.service';
import { UserEntity } from '../user/entities';
import { IpfsService } from '../ipfs/ipfs.service';

type backupData = {
  user: string;
  data: any;
};
@Injectable()
export class BackupService {
  constructor(
    private readonly domainTransferService: Domain_transferService,
    private readonly userService: UserService,
    private readonly ipfsService: IpfsService,
  ) {}
  async backupDomainTransfer() {
    return await this.domainTransferService.findAll();
  }

  async backupUser() {
    const userDbData: UserEntity[] = await this.userService.getAll();
    const userList: any[] = userDbData.map((user) => user.hns_domain);
    return userList;
  }

  async backupFilteredDomainTransfer() {
    const all_mail = await this.backupDomainTransfer();
    const all_user = await this.backupUser();
    const filered_mail: backupData[] = [];
    all_user.forEach((user) => {
      const data = all_mail.filter(
        (mail) =>
          mail.hns_domain_send.hns_domain == user ||
          mail.hns_domain_receive.hns_domain == user,
      );
      filered_mail.push({ user, data });
    });
    await Promise.all(
      filered_mail.map(async (item) => {
        const jsonData = JSON.stringify(item);
        const cid_set = await this.ipfsService.uploadFile(jsonData);
        item.data = cid_set.ipfsHash;
      }),
    );
    const result = await Promise.all(
      filered_mail.map(async (item) => {
        return {
          data: item.data,
        };
      }),
    );
    const cid_set = await this.ipfsService.uploadFile(JSON.stringify(result));
    return cid_set;
  }
}
