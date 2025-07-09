import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { SearchUserFilter } from '../dto/search-user.filter';
import { PageResultMapper } from '../mapper/page-result.mapper';
import { UserVo } from '../vo/user.vo';
import { UserMapper } from '../mapper/user.mapper';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiOkResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { PageResult } from '../vo/page-result';
import { CreateUserRequest } from '../dto/create-user.request';
import { SetUserRolesRequest } from '../dto/set-user-roles.request';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiExtraModels(PageResult, UserVo) // 注册额外模型
  @ApiBearerAuth()
  @ApiOkResponse({
    description: '分页用户列表',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PageResult) }, // 引用 PageResult 模型
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(UserVo) }, // 泛型内容具体化
            },
          },
        },
      ],
    },
  })
  async search(@Query() searchUserFilter: SearchUserFilter) {
    const [data, total] = await this.userService.search(searchUserFilter);
    return PageResultMapper.toPageResult<UserVo>(
      UserMapper.toVos(data),
      searchUserFilter.getPage(),
      searchUserFilter.getSize(),
      total,
    );
  }

  @Get('current')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: '获取当前登录用户信息',
    type: UserVo,
  })
  async current() {
    return UserMapper.toVo(this.userService.getCurrentUser());
  }

  @Post()
  @ApiBearerAuth()
  @ApiOkResponse({
    type: UserVo,
  })
  async create(@Body() createUserRequest: CreateUserRequest) {
    return UserMapper.toVo(await this.userService.create(createUserRequest));
  }

  @Put(':id/lock')
  async lock(@Param('id') id: string) {
    return UserMapper.toVo(await this.userService.lock(id));
  }

  @Put(':id/unlock')
  async unlock(@Param('id') id: string) {
    return UserMapper.toVo(await this.userService.unlock(id));
  }

  @Put(':id/roles')
  @ApiBearerAuth()
  @ApiOkResponse({
    description: '设置用户角色',
    type: UserVo,
  })
  async setUserRoles(
    @Param('id') id: string,
    @Body() setUserRolesRequest: SetUserRolesRequest,
  ) {
    return UserMapper.toVo(
      await this.userService.setUserRoles(id, setUserRolesRequest.roles),
    );
  }
}
