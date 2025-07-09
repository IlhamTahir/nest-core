import { BaseMapper } from '../mapper/base.mapper';
import { Menu } from '../entity/menu.entity';
import { MenuVo } from '../vo/menu.vo';
import { Injectable } from '@nestjs/common';
import { CreateMenuRequest } from '../dto/create-menu.request';
import { UpdateMenuRequest } from '../dto/update-menu.request';

@Injectable()
export class MenuMapper extends BaseMapper<Menu, MenuVo> {
  async toVo(entity: Menu): Promise<MenuVo> {
    const vo = await super.toVo(entity);
    vo.title = entity.title;
    vo.type = entity.type;
    vo.path = entity.path;
    vo.component = entity.component;
    vo.icon = entity.icon;
    vo.redirect = entity.redirect;
    vo.hidden = entity.hidden;
    vo.keepAlive = entity.keepAlive;
    vo.order = entity.order;
    vo.parentId = entity.parentId;
    vo.permission = entity.permission;
    vo.routerName = entity.routerName;
    vo.enabled = entity.enabled;
    return vo;
  }

  async toVos(entities: Menu[]): Promise<MenuVo[]> {
    return Promise.all(entities.map(entity => this.toVo(entity)));
  }

  async fromCreateMenuRequest(
    createMenuRequest: CreateMenuRequest,
  ): Promise<Menu> {
    const menu = new Menu();
    menu.title = createMenuRequest.title;
    menu.type = createMenuRequest.type;
    menu.path = createMenuRequest.path;
    menu.component = createMenuRequest.component;
    menu.icon = createMenuRequest.icon;
    menu.redirect = createMenuRequest.redirect;
    menu.hidden = createMenuRequest.hidden || false;
    menu.keepAlive = createMenuRequest.keepAlive || false;
    menu.order = createMenuRequest.order || 0;
    menu.permission = createMenuRequest.permission;
    menu.routerName = createMenuRequest.routerName;
    menu.parentId = createMenuRequest.parentId || null;
    return menu;
  }

  async fromUpdateMenuRequest(
    menu: Menu,
    updateMenuRequest: UpdateMenuRequest,
  ) {
    menu.title = updateMenuRequest.title;
    menu.type = updateMenuRequest.type;
    menu.path = updateMenuRequest.path;
    menu.component = updateMenuRequest.component;
    menu.icon = updateMenuRequest.icon;
    menu.redirect = updateMenuRequest.redirect;
    menu.hidden = updateMenuRequest.hidden || false;
    menu.keepAlive = updateMenuRequest.keepAlive || false;
    menu.order = updateMenuRequest.order || 0;
    menu.permission = updateMenuRequest.permission;
    menu.routerName = updateMenuRequest.routerName;
    menu.parentId = updateMenuRequest.parentId || null;
    return menu;
  }
}
