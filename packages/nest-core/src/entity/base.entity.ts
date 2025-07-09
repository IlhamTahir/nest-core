import { BeforeInsert, CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { SnowflakeUtil } from '../util/snowflake.util';

export abstract class BaseEntity {
  @PrimaryColumn()
  id: string;

  @CreateDateColumn()
  createdTime: Date;

  @UpdateDateColumn()
  updatedTime: Date;

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = SnowflakeUtil.generateId();
    }
  }
}
