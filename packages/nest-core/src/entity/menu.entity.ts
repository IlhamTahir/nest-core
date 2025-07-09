import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { MenuType } from '../enum/menu-type.enum';
import { Role } from './role.entity';

@Entity('menus')
export class Menu extends BaseEntity {
  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: MenuType,
  })
  type: MenuType;

  @Column({ nullable: true })
  path: string;

  @Column({ nullable: true })
  component: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ nullable: true })
  redirect: string;

  @Column({ default: false })
  hidden: boolean;

  @Column({ default: false })
  keepAlive: boolean;

  @Column({ default: 0 })
  order: number;

  @ManyToOne(() => Menu, (menu) => menu.children, { nullable: true })
  @JoinColumn({ name: 'parentId' })
  parent: Menu;

  @Column({ nullable: true })
  parentId: string;

  @OneToMany(() => Menu, (menu) => menu.parent)
  children: Menu[];

  @Column()
  permission: string;

  @Column({ nullable: true })
  routerName: string;

  @Column({
    default: true,
  })
  enabled: boolean = true;

  @ManyToMany(() => Role, (role) => role.menus)
  roles: Role[];
}
