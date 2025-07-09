import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { SnowflakeUtil } from '../util/snowflake.util';

export abstract class BaseEntity {
  @PrimaryColumn()
  id: string = SnowflakeUtil.generateId();

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;
}
