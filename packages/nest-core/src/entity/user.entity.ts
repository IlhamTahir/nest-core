import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';
import { UserBind } from './user-bind.entity';

@Entity()
export class User extends BaseEntity {
  @Column({
    unique: true,
  })
  username: string;

  @Column({
    unique: true,
  })
  email: string;

  @Column({
    default: false,
  })
  emailVerified: boolean = false;

  @Column()
  encryptedPassword: string;

  @Column({
    default: false,
  })
  locked: boolean = false;

  @Column({
    default: true,
  })
  enabled: boolean = true;

  @ManyToMany(() => Role, (role) => role.users, { eager: true })
  @JoinTable({
    name: 'user_role',
  })
  roles: Role[];

  @OneToMany(() => UserBind, (bind) => bind.user)
  binds: UserBind[];

  @Column()
  userIdentifier: number;
}
