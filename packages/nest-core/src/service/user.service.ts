import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SearchUserFilter } from '../dto/search-user.filter';
import { JwtPayload } from 'jsonwebtoken';
import { CreateUserRequest } from '../dto/create-user.request';
import { BizException } from '../exception/biz.exception';
import { UserError } from '../error/user.error';
import { Role } from '../entity/role.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {}

  private currentUser: User;

  setCurrentUser(user: User) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }

  async setCurrentUserByJwtPayload(payload: JwtPayload) {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['roles'],
    });
    this.setCurrentUser(user);
  }

  async get(id: string) {
    const user = this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      throw new BizException(UserError.NOT_FOUND);
    }
    return user;
  }

  async getUserWithRoles(id: string) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['roles'],
    });
    if (!user) {
      throw new BizException(UserError.NOT_FOUND);
    }
    return user;
  }

  async findByUserName(username: string) {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  async createInitialUser() {
    const superAdminRole = await this.initSuperAdminRole();
    const adminRole = await this.initAdminRole();
    await this.initArtistRole();
    try {
      const existingUser = await this.userRepository.findOne({
        where: { username: 'admin' },
        relations: ['roles'],
      });
      if (existingUser && existingUser.roles.length === 0) {
        existingUser.roles = [superAdminRole, adminRole];
        return await this.userRepository.save(existingUser);
      }
      if (!existingUser) {
        const salt = await bcrypt.genSalt();
        const encryptedPassword = await bcrypt.hash('admin123', salt);

        const user = this.userRepository.create({
          username: 'admin',
          email: 'admin@bilig.biz',
          emailVerified: true,
          encryptedPassword,
          roles: [superAdminRole, adminRole],
          locked: false,
          enabled: true,
        });

        await this.userRepository.save(user);
        console.log('Initial admin user created');
      } else {
        console.log('Admin user already exists');
      }
    } catch (error) {
      console.log('Error creating initial user', error);
    }
  }

  async initSuperAdminRole() {
    try {
      const existingRole = await this.roleRepository.findOne({
        where: { name: 'ROLE_SUPER_ADMIN' },
      });
      if (!existingRole) {
        const role = this.roleRepository.create({
          name: 'ROLE_SUPER_ADMIN',
          label: '超级管理员',
          description: '系统超级管理员，拥有所有权限',
          isSystem: true,
        });
        console.log('Initial super admin role created');
        return await this.roleRepository.save(role);
      } else {
        console.log('Super admin role already exists');
        return existingRole;
      }
    } catch (error) {
      console.log('Error creating super admin role', error);
      throw error;
    }
  }

  async initAdminRole() {
    try {
      const existingRole = await this.roleRepository.findOne({
        where: { name: 'admin' },
      });
      if (!existingRole) {
        const role = this.roleRepository.create({
          name: 'admin',
          label: '管理员',
        });
        console.log('Initial admin role created');
        return await this.roleRepository.save(role);
      } else {
        console.log('Admin role already exists');
        return existingRole;
      }
    } catch (error) {
      console.log('Error creating admin role', error);
      throw error;
    }
  }

  async initArtistRole() {
    try {
      const existingRole = await this.roleRepository.findOne({
        where: { name: 'ROLE_ARTIST' },
      });
      if (!existingRole) {
        const role = this.roleRepository.create({
          name: 'ROLE_ARTIST',
          label: '艺术家',
          description: '艺术家角色，可以管理自己的作品',
          isSystem: true,
        });
        console.log('Initial artist role created');
        return await this.roleRepository.save(role);
      } else {
        console.log('Artist role already exists');
        return existingRole;
      }
    } catch (error) {
      console.log('Error creating artist role', error);
      throw error;
    }
  }

  async search(searchUserFilter: SearchUserFilter) {
    return this.userRepository.findAndCount({
      where: searchUserFilter.getConditions(),
      skip: searchUserFilter.getSkip(),
      take: searchUserFilter.getSize(),
      order: searchUserFilter.getOrderBy(),
      relations: ['roles'],
    });
  }

  async create(createUserRequest: CreateUserRequest) {
    const user = new User();
    user.username = createUserRequest.username;
    const salt = await bcrypt.genSalt();
    user.encryptedPassword = await bcrypt.hash(
      createUserRequest.password,
      salt,
    );
    user.email = createUserRequest.email;

    // 默认分配艺术家角色
    const artistRole = await this.roleRepository.findOne({
      where: { name: 'ROLE_ARTIST' }
    });

    if (artistRole) {
      user.roles = [artistRole];
    }

    return this.userRepository.save(user);
  }

  async lock(id: string) {
    if (this.currentUser.id === id) {
      throw new BizException(UserError.CANNOT_LOCK_SELF);
    }
    const user = await this.get(id);

    user.locked = true;
    return this.userRepository.save(user);
  }

  /**
   * 根据用户名或邮箱查找用户
   * @param identifier 用户名或邮箱
   * @returns 用户实体或 undefined
   */
  async findByIdentifier(identifier: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: [{ username: identifier }, { email: identifier }],
    });
  }

  async unlock(id: string) {
    const user = await this.get(id);
    user.locked = false;
    return this.userRepository.save(user);
  }

  async setUserRoles(userId: string, roleIds: string[]) {
    const user = await this.getUserWithRoles(userId);

    // 查找所有指定的角色
    const roles = await this.roleRepository.find({
      where: { id: In(roleIds) }
    });

    if (roles.length !== roleIds.length) {
      throw new BizException({ code: 400, message: '部分角色不存在' });
    }

    // 设置用户角色
    user.roles = roles;
    return this.userRepository.save(user);
  }
}
