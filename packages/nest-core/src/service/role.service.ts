import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../entity/role.entity';
import { Permission } from '../entity/permission.entity';
import { Menu } from '../entity/menu.entity';
import { Repository } from 'typeorm';
import { CreateRoleRequest } from '../dto/create-role.request';
import { AssignRoleMenusRequest } from '../dto/assign-role-menus.request';
import { BizException } from '../exception/biz.exception';
import { SearchRoleFilter } from '../dto/search-role.filter';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Menu) private readonly menuRepository: Repository<Menu>,
  ) {}

  async create(createRoleRequest: CreateRoleRequest) {
    const role = new Role();
    role.name = createRoleRequest.name;
    role.label = createRoleRequest.label;
    return this.roleRepository.save(role);
  }

  async findAll() {
    return this.roleRepository.find({
      relations: ['menus'],
    });
  }

  async search(searchRoleFilter: SearchRoleFilter) {
    return this.roleRepository.findAndCount({
      where: searchRoleFilter.getConditions(),
      skip: searchRoleFilter.getSkip(),
      take: searchRoleFilter.getSize(),
      order: searchRoleFilter.getOrderBy(),
      relations: ['menus'],
    });
  }

  async findById(id: string) {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['menus'],
    });
    if (!role) {
      throw new BizException({ code: 404, message: '角色不存在' });
    }
    return role;
  }

  async assignMenus(
    roleId: string,
    assignRoleMenusRequest: AssignRoleMenusRequest,
  ) {
    const role = await this.findById(roleId);

    // 查找所有指定的菜单
    const menus = await this.menuRepository.findByIds(
      assignRoleMenusRequest.menuIds,
    );

    // 分配菜单给角色
    role.menus = menus;
    return this.roleRepository.save(role);
  }

  async getRoleMenus(roleId: string) {
    const role = await this.findById(roleId);
    return role.menus;
  }

  async delete(id: string) {
    const role = await this.findById(id);

    // 检查是否为系统预设角色
    if (role.isSystem) {
      throw new BizException({
        code: 400,
        message: '系统预设角色不能被删除'
      });
    }

    // 检查是否有用户使用此角色
    const usersWithRole = await this.roleRepository
      .createQueryBuilder('role')
      .leftJoin('role.users', 'user')
      .where('role.id = :roleId', { roleId: id })
      .andWhere('user.id IS NOT NULL')
      .getCount();

    if (usersWithRole > 0) {
      throw new BizException({
        code: 400,
        message: '该角色正在被用户使用，无法删除'
      });
    }

    await this.roleRepository.remove(role);
  }
}
