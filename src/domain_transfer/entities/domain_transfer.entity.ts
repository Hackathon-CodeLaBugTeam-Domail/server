import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entities';
import { Exclude } from 'class-transformer';

@Entity('domain_transfers')
export class DomainTransferEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  cid: string;

  @Column()
  encryptMessagePrivate: string;

  @Column()
  @Exclude()
  @CreateDateColumn({
    type: 'timestamptz',
  })
  createdAt: Date;

  @Exclude()
  @UpdateDateColumn({
    type: 'timestamptz',
  })
  updatedAt: Date;

  @Exclude()
  @DeleteDateColumn({
    type: 'timestamptz',
  })
  deletedAt?: Date;

  @ManyToOne(() => UserEntity, (user) => user.hns_domain_receive)
  @JoinColumn({ name: 'hns_domain_receive' })
  hns_domain_receive: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.hns_domain_send)
  @JoinColumn({ name: 'hns_domain_send' })
  hns_domain_send: UserEntity;
}
