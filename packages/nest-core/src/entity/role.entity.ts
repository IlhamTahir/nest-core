import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';
import { Permission } from './permission.entity';
import { Menu } from './menu.entity';

@Entity()
export class Role extends BaseEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  label: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: false })
  isSystem: boolean = false;

  @ManyToMany(() => Permission, (permission) => permission.roles)
  @JoinTable({
    name: 'role_permission',
  })
  permissions: Permission[];

  @ManyToMany(() => Menu, (menu) => menu.roles)
  @JoinTable({
    name: 'role_menu',
  })
  menus: Menu[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];
}
