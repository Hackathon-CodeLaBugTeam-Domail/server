import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '../../database';
import { Exclude } from 'class-transformer';
import { DomainTransferEntity } from '../../domain_transfer/entities/domain_transfer.entity';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {
  @PrimaryColumn()
  hns_domain: string;

  @Exclude() // Ẩn trường code khi truy vấn từ cơ sở dữ liệu
  @Column({ nullable: true })
  code: string;

  @Exclude()
  @Column({ nullable: true })
  publicKey: string;

  @Exclude()
  @Column({ nullable: true })
  refreshToken: string;

  @OneToMany(
    () => DomainTransferEntity,
    (domainTransfer) => domainTransfer.hns_domain_send,
  )
  hns_domain_send: DomainTransferEntity[];

  @OneToMany(
    () => DomainTransferEntity,
    (domainTransfer) => domainTransfer.hns_domain_receive,
  )
  hns_domain_receive: DomainTransferEntity[];
}
