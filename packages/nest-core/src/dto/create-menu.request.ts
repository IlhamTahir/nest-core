import { IsNotEmpty, IsOptional } from 'class-validator';
import { MenuType } from '../enum/menu-type.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuRequest {
  @IsNotEmpty({
    message: '菜单标题不能为空',
  })
  @ApiProperty({
    description: '菜单标题',
  })
  title: string;

  @IsNotEmpty({
    message: '菜单类型不能为空',
  })
  @ApiProperty({
    description: '菜单类型',
    enum: MenuType,
  })
  type: MenuType;

  @IsOptional()
  @ApiProperty({
    description: '菜单路径',
  })
  path: string;

  @IsOptional()
  @ApiProperty({
    description: '组件路径',
    required: false,
  })
  component: string;

  @IsOptional()
  @ApiProperty({
    description: '菜单图标',
    required: false,
  })
  icon: string;

  @IsOptional()
  @ApiProperty({
    description: '重定向路径',
    required: false,
  })
  redirect: string;

  @IsOptional()
  @ApiProperty({
    description: '是否隐藏菜单',
    default: false,
    required: false,
  })
  hidden: boolean = false;

  @IsOptional()
  @ApiProperty({
    description: '是否缓存菜单',
    default: false,
    required: false,
  })
  keepAlive: boolean;

  @IsOptional()
  @ApiProperty({
    description: '菜单排序',
    default: 0,
    required: false,
  })
  order: number;

  @IsOptional()
  @ApiProperty({
    description: '父菜单ID',
    required: false,
  })
  parentId: string;

  @IsNotEmpty()
  @ApiProperty({
    description: '权限标识',
  })
  permission: string;

  @IsOptional()
  @ApiProperty({
    description: '路由名称',
    required: false,
  })
  routerName: string;
}
