import { BaseEntity } from './base.entity';
import { BeforeInsert, BeforeUpdate, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { RequestContext } from 'nestjs-request-context';

export abstract class TraceableEntity extends BaseEntity {
  @ManyToOne(() => User, { eager: true })
  createBy: User;

  @ManyToOne(() => User, { eager: true })
  updateBy: User;

  @BeforeInsert()
  setCreatedBy() {
    this.createBy = RequestContext.currentContext.req.user.id || null;
    this.updateBy = RequestContext.currentContext.req.user.id || null;
  }

  @BeforeUpdate()
  setUpdatedBy() {
    this.updateBy = RequestContext.currentContext.req.user.id || null;
  }
}
