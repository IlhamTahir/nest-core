import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RoleService } from '../service/role.service';
import { CreateRoleRequest } from '../dto/create-role.request';
import { AssignRoleMenusRequest } from '../dto/assign-role-menus.request';
import { ApiBearerAuth, ApiResponse, ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { RoleVo } from '../vo/role.vo';
import { MenuVo } from '../vo/menu.vo';
import { RoleMapper } from '../mapper/role.mapper';
import { MenuMapper } from '../mapper/menu.mapper';
import { PageResult } from '../vo/page-result';
import { PageResultMapper } from '../mapper/page-result.mapper';
import { SearchRoleFilter } from '../dto/search-role.filter';

@Controller('roles')
export class RoleController {
  constructor(
    private readonly roleService: RoleService,
    private readonly menuMapper: MenuMapper,
  ) {}

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role',
    type: RoleVo,
  })
  @ApiBearerAuth()
  @Post()
  async create(@Body() createRoleRequest: CreateRoleRequest) {
    return RoleMapper.toVo(await this.roleService.create(createRoleRequest));
  }

  @ApiExtraModels(PageResult, RoleVo)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: '分页角色列表',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PageResult) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(RoleVo) },
            },
          },
        },
      ],
    },
  })
  @Get()
  async findAll(@Query() searchRoleFilter: SearchRoleFilter) {
    const [data, total] = await this.roleService.search(searchRoleFilter);
    return PageResultMapper.toPageResult<RoleVo>(
      data.map((role) => RoleMapper.toVo(role)),
      searchRoleFilter.getPage(),
      searchRoleFilter.getSize(),
      total,
    );
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role',
    type: RoleVo,
  })
  @ApiBearerAuth()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return RoleMapper.toVo(await this.roleService.findById(id));
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Assign menus to role',
    type: RoleVo,
  })
  @ApiBearerAuth()
  @Put(':id/menus')
  async assignMenus(
    @Param('id') id: string,
    @Body() assignRoleMenusRequest: AssignRoleMenusRequest,
  ) {
    const role = await this.roleService.assignMenus(id, assignRoleMenusRequest);
    return RoleMapper.toVo(role);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role menus',
    type: [MenuVo],
  })
  @ApiBearerAuth()
  @Get(':id/menus')
  async getRoleMenus(@Param('id') id: string) {
    const menus = await this.roleService.getRoleMenus(id);
    return this.menuMapper.toVos(menus);
  }

  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Role deleted successfully',
  })
  @ApiBearerAuth()
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.roleService.delete(id);
    return { message: '角色删除成功' };
  }
}
