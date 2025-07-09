import { Column, Entity, JoinTable, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity()
export class UserBind extends BaseEntity {
  @ManyToOne(() => User, (user) => user.binds, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'user_id',
  })
  user: User;

  @Column()
  type: string; // 绑定类型，例如 'wechat', 'email'

  @Column()
  bindId: string; // 对应绑定表（如 WechatUser）的主键
}
