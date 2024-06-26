import { Exclude } from 'class-transformer';
import {
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class AbstractEntity {

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
}
