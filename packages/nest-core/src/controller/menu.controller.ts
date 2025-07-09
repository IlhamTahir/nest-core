import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { MenuService } from '../service/menu.service';
import { CreateMenuRequest } from '../dto/create-menu.request';
import { MenuVo } from '../vo/menu.vo';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SearchMenuFilter } from '../dto/search-menu.filter';
import { PageResult } from '../vo/page-result';

@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @ApiBearerAuth()
  @ApiResponse({
    type: MenuVo,
  })
  async create(@Body() createMenuRequest: CreateMenuRequest): Promise<MenuVo> {
    return this.menuService.createMenu(createMenuRequest);
  }

  @Get()
  async page(
    @Query() searchMenuFilter: SearchMenuFilter,
  ): Promise<PageResult<MenuVo>> {
    return this.menuService.page(searchMenuFilter);
  }

  @Get('tree')
  @ApiBearerAuth()
  @ApiResponse({
    type: [MenuVo],
  })
  async getMenuTree(): Promise<MenuVo[]> {
    return this.menuService.getMenuTree();
  }

  @Get('user-menus')
  @ApiBearerAuth()
  @ApiResponse({
    type: [MenuVo],
  })
  async getUserMenus(@Request() req): Promise<MenuVo[]> {
    const user = req.user;
    return this.menuService.getUserMenus(user);
  }

  @Put('fix-super-admin')
  @ApiBearerAuth()
  async fixSuperAdminMenus(): Promise<{ success: boolean }> {
    const success = await this.menuService.fixSuperAdminMenus();
    return { success };
  }

  @Put('reinitialize')
  @ApiBearerAuth()
  async reinitializeMenus(): Promise<{ success: boolean }> {
    const success = await this.menuService.reinitializeMenus();
    return { success };
  }

  @Post('create-test-artist')
  @ApiBearerAuth()
  async createTestArtist(): Promise<{ success: boolean }> {
    const success = await this.menuService.createTestArtist();
    return { success };
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiResponse({
    type: MenuVo,
  })
  async get(@Param('id') id: string): Promise<MenuVo> {
    return this.menuService.get(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMenuRequest: CreateMenuRequest,
  ): Promise<MenuVo> {
    return this.menuService.update(id, updateMenuRequest);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.menuService.delete(id);
  }

  @Put(':id/enable')
  async enable(@Param('id') id: string): Promise<void> {
    return this.menuService.enable(id);
  }

  @Put(':id/disable')
  async disable(@Param('id') id: string): Promise<void> {
    return this.menuService.disable(id);
  }
}
