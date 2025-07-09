import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Menu } from '../entity/menu.entity';
import { User } from '../entity/user.entity';
import { Role } from '../entity/role.entity';
import { Repository } from 'typeorm';
import { MenuMapper } from '../mapper/menu.mapper';
import { CreateMenuRequest } from '../dto/create-menu.request';
import { MenuVo } from '../vo/menu.vo';
import { PageResult } from '../vo/page-result';
import { SearchMenuFilter } from '../dto/search-menu.filter';
import { PageResultMapper } from '../mapper/page-result.mapper';
import { BizException } from '../exception/biz.exception';
import { menuError } from '../error/menu.error';
import { UpdateMenuRequest } from '../dto/update-menu.request';
import { MenuType } from '../enum/menu-type.enum';
import * as bcrypt from 'bcrypt';

@Injectable()
export class MenuService {
  constructor(
    @InjectRepository(Menu)
    private readonly menuRepository: Repository<Menu>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly menuMapper: MenuMapper,
  ) {}

  // 创建菜单
  async createMenu(createMenuRequest: CreateMenuRequest): Promise<MenuVo> {
    const menu = await this.menuMapper.fromCreateMenuRequest(createMenuRequest);
    return this.menuMapper.toVo(await this.menuRepository.save(menu));
  }

  // 分页查询菜单
  async page(searchMenuFilter: SearchMenuFilter): Promise<PageResult<MenuVo>> {
    const [data, total] = await this.menuRepository.findAndCount({
      where: searchMenuFilter.getConditions(),
      skip: searchMenuFilter.getSkip(),
      take: searchMenuFilter.getSize(),
      order: searchMenuFilter.getOrderBy(),
    });

    return PageResultMapper.toPageResult<MenuVo>(
      await this.menuMapper.toVos(data),
      searchMenuFilter.getPage(),
      searchMenuFilter.getSize(),
      total,
    );
  }

  // 获取某个菜单详情
  async get(id: string): Promise<MenuVo> {
    const menu = await this.getEntityById(id);
    return this.menuMapper.toVo(menu);
  }

  // 更新某个菜单
  async update(
    id: string,
    updateMenuRequest: UpdateMenuRequest,
  ): Promise<MenuVo> {
    const menu = await this.getEntityById(id);

    const updatedMenu = await this.menuMapper.fromUpdateMenuRequest(
      menu,
      updateMenuRequest,
    );
    return this.menuMapper.toVo(await this.menuRepository.save(updatedMenu));
  }

  async delete(id: string): Promise<void> {
    const menu = await this.getEntityById(id, ['children']);
    if (menu.children && menu.children.length > 0) {
      throw new BizException(menuError.HAS_CHILDREN);
    }
    await this.menuRepository.remove(menu);
  }

  private async getEntityById(
    id: string,
    relations: string[] = [],
  ): Promise<Menu> {
    const entity = await this.menuRepository.findOne({
      where: { id },
      relations,
    });
    if (!entity) {
      throw new BizException(menuError.NOT_FOUND);
    }
    return entity;
  }

  async enable(id: string) {
    const menu = await this.getEntityById(id);
    menu.enabled = true;
    await this.menuRepository.save(menu);
  }

  async disable(id: string) {
    const menu = await this.getEntityById(id);
    menu.enabled = false;
    await this.menuRepository.save(menu);
  }

  // 获取菜单树形结构
  async getMenuTree(): Promise<MenuVo[]> {
    const menus = await this.menuRepository.find({
      order: { order: 'ASC', createdTime: 'ASC' },
    });

    const menuVos = await this.menuMapper.toVos(menus);
    return this.buildMenuTree(menuVos);
  }

  // 根据用户获取菜单（考虑角色权限）
  async getUserMenus(user: User): Promise<MenuVo[]> {
    // 如果是超级管理员，返回所有菜单
    if (user.roles.some((role) => role.name === 'ROLE_SUPER_ADMIN')) {
      return this.getMenuTree();
    }

    // 如果是艺术家角色，只返回作品管理菜单
    if (user.roles.some((role) => role.name === 'ROLE_ARTIST')) {
      return this.getArtistMenus();
    }

    // 获取用户角色关联的菜单
    const roleIds = user.roles.map((role) => role.id);

    const menus = await this.menuRepository
      .createQueryBuilder('menu')
      .leftJoinAndSelect('menu.roles', 'role')
      .where('role.id IN (:...roleIds)', { roleIds })
      .andWhere('menu.enabled = :enabled', { enabled: true })
      .orderBy('menu.order', 'ASC')
      .addOrderBy('menu.createdTime', 'ASC')
      .getMany();

    const menuVos = await this.menuMapper.toVos(menus);
    return this.buildMenuTree(menuVos);
  }

  // 获取艺术家角色的菜单（作品管理和结算管理）
  async getArtistMenus(): Promise<MenuVo[]> {
    const menus = await this.menuRepository.find({
      where: [
        { path: 'albums', enabled: true }, // 作品管理
        { path: 'settlement', enabled: true }, // 结算管理
      ],
      order: { order: 'ASC', createdTime: 'ASC' },
    });

    return await this.menuMapper.toVos(menus);
  }

  private buildMenuTree(menus: MenuVo[]): MenuVo[] {
    const menuMap = new Map<string, MenuVo & { children?: MenuVo[] }>();
    const rootMenus: (MenuVo & { children?: MenuVo[] })[] = [];

    // 初始化所有菜单
    menus.forEach((menu) => {
      menuMap.set(menu.id, { ...menu, children: [] });
    });

    // 构建树形结构
    menus.forEach((menu) => {
      const menuWithChildren = menuMap.get(menu.id);
      if (menu.parentId && menuMap.has(menu.parentId)) {
        const parent = menuMap.get(menu.parentId);
        parent.children.push(menuWithChildren);
      } else {
        rootMenus.push(menuWithChildren);
      }
    });

    return rootMenus;
  }

  // 初始化基础菜单数据
  async initializeMenus() {
    const existingMenus = await this.menuRepository.count();
    if (existingMenus > 0) {
      console.log('Menus already initialized, checking for routerName updates...');
      await this.updateExistingMenusWithRouterName();
      return;
    }

    const baseMenus = [
      {
        title: '仪表盘',
        type: MenuType.MENU,
        path: 'dashboard',
        component: 'dashboard/index.vue',
        icon: 'app',
        permission: 'dashboard:view',
        order: 1,
        enabled: true,
        routerName: 'dashboard',
      },
      // 系统管理分组
      {
        title: '系统管理',
        type: MenuType.GROUP,
        icon: 'setting',
        permission: 'system:view',
        order: 2,
        enabled: true,
      },
      // 内容管理分组
      {
        title: '内容管理',
        type: MenuType.GROUP,
        icon: 'folder',
        permission: 'content:view',
        order: 3,
        enabled: true,
      },
      // 财务管理分组
      {
        title: '财务管理',
        type: MenuType.GROUP,
        icon: 'money',
        permission: 'finance:view',
        order: 4,
        enabled: true,
      },
    ];

    try {
      // 先创建分组和仪表盘
      const createdMenus = [];
      for (const menuData of baseMenus) {
        const menu = this.menuRepository.create(menuData);
        const savedMenu = await this.menuRepository.save(menu);
        createdMenus.push(savedMenu);
      }

      // 找到分组
      const systemGroup = createdMenus.find((m) => m.title === '系统管理');
      const contentGroup = createdMenus.find((m) => m.title === '内容管理');
      const financeGroup = createdMenus.find((m) => m.title === '财务管理');

      // 创建系统管理下的菜单
      const systemMenus = [
        {
          title: '用户管理',
          type: MenuType.MENU,
          path: 'users',
          component: 'user/index.vue',
          icon: 'user',
          permission: 'user:list',
          order: 1,
          enabled: true,
          parentId: systemGroup?.id,
          routerName: 'users',
        },
        {
          title: '角色管理',
          type: MenuType.MENU,
          path: 'roles',
          component: 'role/index.vue',
          icon: 'secured',
          permission: 'role:list',
          order: 2,
          enabled: true,
          parentId: systemGroup?.id,
          routerName: 'roles',
        },
        {
          title: '菜单管理',
          type: MenuType.MENU,
          path: 'menu',
          component: 'menu/index.vue',
          icon: 'menu',
          permission: 'menu:list',
          order: 3,
          enabled: true,
          parentId: systemGroup?.id,
          routerName: 'menu',
        },
      ];

      // 创建内容管理下的菜单
      const contentMenus = [
        {
          title: '作品管理',
          type: MenuType.MENU,
          path: 'albums',
          component: 'album/index.vue',
          icon: 'music',
          permission: 'album:list',
          order: 1,
          enabled: true,
          parentId: contentGroup?.id,
          routerName: 'albums',
        },
        {
          title: '作品编辑',
          type: MenuType.MENU,
          path: 'albums/:id/manage',
          component: 'album/manage.vue',
          permission: 'album:edit',
          order: 2,
          enabled: true,
          hidden: true, // 隐藏菜单，不在侧边栏显示
          parentId: contentGroup?.id,
          routerName: 'album-manage',
        },
        {
          title: '曲风管理',
          type: MenuType.MENU,
          path: 'genera',
          component: 'genera/index.vue',
          icon: 'guitar',
          permission: 'genera:list',
          order: 3,
          enabled: true,
          parentId: contentGroup?.id,
          routerName: 'genera',
        },
      ];

      // 创建财务管理下的菜单
      const financeMenus = [
        {
          title: '账单管理',
          type: MenuType.MENU,
          path: 'bill',
          component: 'bill/index.vue',
          icon: 'money',
          permission: 'bill:list',
          order: 1,
          enabled: true,
          parentId: financeGroup?.id,
          routerName: 'bill',
        },
        {
          title: '收益管理',
          type: MenuType.MENU,
          path: 'revenue',
          component: 'revenue/index.vue',
          icon: 'chart',
          permission: 'revenue:list',
          order: 2,
          enabled: true,
          parentId: financeGroup?.id,
          routerName: 'revenue',
        },
        {
          title: '结算管理',
          type: MenuType.MENU,
          path: 'settlement',
          component: 'settlement/index.vue',
          icon: 'money-circle',
          permission: 'settlement:view',
          order: 3,
          enabled: true,
          parentId: financeGroup?.id,
          routerName: 'settlement',
        },
      ];

      // 创建所有子菜单
      const allSubMenus = [...systemMenus, ...contentMenus, ...financeMenus];
      for (const menuData of allSubMenus) {
        const menu = this.menuRepository.create(menuData);
        const savedMenu = await this.menuRepository.save(menu);
        createdMenus.push(savedMenu);
      }

      // 找到作品编辑菜单，为其创建子菜单
      const albumManageMenu = createdMenus.find(menu => menu.routerName === 'album-manage');
      if (albumManageMenu) {
        const albumSubMenus = [
          {
            title: '基础设置',
            type: MenuType.MENU,
            path: 'basic',
            component: 'album/basic.vue',
            permission: 'album:edit',
            order: 1,
            enabled: true,
            hidden: true, // 隐藏菜单，不在侧边栏显示
            parentId: albumManageMenu.id, // 作为作品编辑的子菜单
            routerName: 'album-manage-basic',
          },
          {
            title: '曲目管理',
            type: MenuType.MENU,
            path: 'tracks',
            component: 'album/tracks.vue',
            permission: 'album:edit',
            order: 2,
            enabled: true,
            hidden: true, // 隐藏菜单，不在侧边栏显示
            parentId: albumManageMenu.id, // 作为作品编辑的子菜单
            routerName: 'album-manage-tracks',
          },
        ];

        for (const subMenuData of albumSubMenus) {
          const subMenu = this.menuRepository.create(subMenuData);
          const savedSubMenu = await this.menuRepository.save(subMenu);
          createdMenus.push(savedSubMenu);
        }
      }

      // 为超级管理员角色分配所有菜单权限
      await this.assignMenusToSuperAdmin(createdMenus);

      console.log('Base menus with groups initialized successfully');
    } catch (error) {
      console.error('Failed to initialize menus:', error);
    }
  }

  // 更新现有菜单的 routerName 字段
  async updateExistingMenusWithRouterName() {
    try {
      console.log('Updating existing menus with routerName...');

      // 定义菜单路由名称映射
      const menuRouterNameMap = {
        'dashboard': 'dashboard',
        'users': 'users',
        'roles': 'roles',
        'menu': 'menu',
        'albums': 'albums',
        'albums/:id/manage': 'album-manage',
        'basic': 'album-manage-basic',
        'tracks': 'album-manage-tracks',
        'genera': 'genera',
        'bill': 'bill',
        'revenue': 'revenue',
      };

      // 获取所有菜单
      const allMenus = await this.menuRepository.find();
      let updatedCount = 0;

      for (const menu of allMenus) {
        // 如果菜单没有 routerName 或者 routerName 为空，则更新
        if (!menu.routerName && menu.path && menuRouterNameMap[menu.path]) {
          menu.routerName = menuRouterNameMap[menu.path];
          await this.menuRepository.save(menu);
          updatedCount++;
          console.log(`Updated menu "${menu.title}" with routerName: ${menu.routerName}`);
        }
      }

      console.log(`Updated ${updatedCount} menus with routerName`);
    } catch (error) {
      console.error('Failed to update existing menus with routerName:', error);
    }
  }

  private async assignMenusToSuperAdmin(menus: Menu[]) {
    try {
      // 获取超级管理员角色
      const superAdminRole = await this.roleRepository.findOne({
        where: { name: 'ROLE_SUPER_ADMIN' },
        relations: ['menus'],
      });

      if (superAdminRole) {
        // 为超级管理员分配所有菜单
        superAdminRole.menus = menus;
        await this.roleRepository.save(superAdminRole);
        console.log('Assigned all menus to super admin role');
      }
    } catch (error) {
      console.error('Failed to assign menus to super admin:', error);
    }
  }

  // 临时方法：为超级管理员分配所有现有菜单
  async fixSuperAdminMenus() {
    try {
      // 获取所有菜单
      const allMenus = await this.menuRepository.find({
        where: { enabled: true },
      });

      // 获取超级管理员角色
      const superAdminRole = await this.roleRepository.findOne({
        where: { name: 'ROLE_SUPER_ADMIN' },
        relations: ['menus'],
      });

      if (superAdminRole && allMenus.length > 0) {
        // 为超级管理员分配所有菜单
        superAdminRole.menus = allMenus;
        await this.roleRepository.save(superAdminRole);
        console.log('Fixed: Assigned all menus to super admin role');
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to fix super admin menus:', error);
      return false;
    }
  }

  // 临时方法：重新初始化菜单（清除现有菜单并重新创建）
  async reinitializeMenus() {
    try {
      // 清除现有菜单
      await this.menuRepository.delete({});
      console.log('Cleared existing menus');

      // 重新初始化菜单
      await this.initializeMenus();
      console.log('Reinitialized menus with groups');
      return true;
    } catch (error) {
      console.error('Failed to reinitialize menus:', error);
      return false;
    }
  }

  // 临时方法：创建测试艺术家用户
  async createTestArtist() {
    try {
      // 获取艺术家角色
      const artistRole = await this.roleRepository.findOne({
        where: { name: 'ROLE_ARTIST' },
      });

      if (!artistRole) {
        console.error('Artist role not found');
        return false;
      }

      // 检查是否已存在测试艺术家用户
      const existingArtist = await this.userRepository.findOne({
        where: { username: 'artist' },
      });

      if (existingArtist) {
        console.log('Test artist user already exists');
        return true;
      }

      // 创建测试艺术家用户
      const salt = await bcrypt.genSalt();
      const encryptedPassword = await bcrypt.hash('artist123', salt);

      const artistUser = this.userRepository.create({
        username: 'artist',
        email: 'artist@example.com',
        emailVerified: true,
        encryptedPassword,
        roles: [artistRole],
        locked: false,
        enabled: true,
      });

      await this.userRepository.save(artistUser);
      console.log('Test artist user created: artist / artist123');
      return true;
    } catch (error) {
      console.error('Failed to create test artist:', error);
      return false;
    }
  }
}
