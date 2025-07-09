import { BaseFilter } from '../dto/base.filter';
import { MenuType } from '../enum/menu-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class SearchMenuFilter extends BaseFilter {
  @ApiProperty({
    required: false,
    description: '菜单标题搜索关键字',
  })
  title?: string; // 菜单标题

  @ApiProperty({
    required: false,
    description: '菜单类型',
    enum: MenuType,
  })
  type?: MenuType; // 菜单类型

  @ApiProperty({
    required: false,
    description: '是否隐藏菜单',
  })
  hidden?: boolean; // 是否隐藏菜单

  @ApiProperty({
    required: false,
    description: '父菜单ID',
  })
  parentId?: string; // 父菜单ID

  @ApiProperty({
    required: false,
    description: '权限标识',
  })
  permission?: string; // 权限标识

  @ApiProperty({
    required: false,
    description: '是否启用菜单',
  })
  enabled?: boolean; // 是否启用菜单
}
