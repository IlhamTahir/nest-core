import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';

@Entity()
export class Permission extends BaseEntity {
  @Column({ unique: true })
  name: string; // 系统唯一权限标识，如 music.create

  @Column()
  label: string; // 可读权限名称，如 '创建音乐'

  @Column({ nullable: true })
  description: string; // 备注说明

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];
}
