import { Controller, Post, Get, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { NoAuth } from '@ilhamtahir/nest-core';
import { MediaService } from './media.service';
import { InitUploadRequest } from './dto/init-upload.request';
import {
  InitUploadVo,
  MediaDetailVo,
  PlayTokenVo,
  AvailableResolutionsVo,
} from './vo/media.vo';

/**
 * 媒体管理控制器
 */
@ApiTags('Media')
@Controller('api/media')
@NoAuth() // 跳过认证，用于测试
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('init-upload')
  @ApiOperation({
    summary: '初始化媒体上传',
    description: '创建媒体记录并返回上传地址与mediaId',
  })
  @ApiResponse({
    status: 201,
    description: '初始化成功',
    type: InitUploadVo,
  })
  @ApiResponse({ status: 400, description: '请求参数错误' })
  async initUpload(
    @Body() initUploadRequest: InitUploadRequest,
    @Req() req: any,
  ): Promise<InitUploadVo> {
    const creatorId = req.user?.id || 'system';

    return await this.mediaService.initUpload(initUploadRequest, creatorId);
  }

  @Get(':id')
  @ApiOperation({
    summary: '获取媒体详情',
    description: '根据媒体ID获取详细信息',
  })
  @ApiParam({ name: 'id', description: '媒体ID' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: MediaDetailVo,
  })
  @ApiResponse({ status: 404, description: '媒体不存在' })
  async getMediaDetail(@Param('id') id: string): Promise<MediaDetailVo> {
    return await this.mediaService.getMediaDetail(id);
  }

  @Get(':id/play-token')
  @ApiOperation({
    summary: '获取播放Token',
    description: '获取媒体播放的临时Token',
  })
  @ApiParam({ name: 'id', description: '媒体ID' })
  @ApiQuery({ 
    name: 'resolution', 
    description: '分辨率', 
    required: false,
    example: '720p'
  })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: PlayTokenVo,
  })
  @ApiResponse({ status: 404, description: '媒体不存在' })
  @ApiResponse({ status: 400, description: '媒体尚未处理完成' })
  async getPlayToken(
    @Param('id') id: string,
    @Query('resolution') resolution?: string,
  ): Promise<PlayTokenVo> {
    const playUrl = await this.mediaService.getPlayToken(id, resolution);
    return { playUrl };
  }

  @Get(':id/resolutions')
  @ApiOperation({
    summary: '获取可用分辨率',
    description: '获取媒体的所有可用分辨率',
  })
  @ApiParam({ name: 'id', description: '媒体ID' })
  @ApiResponse({
    status: 200,
    description: '获取成功',
    type: AvailableResolutionsVo,
  })
  @ApiResponse({ status: 404, description: '媒体不存在' })
  async getAvailableResolutions(
    @Param('id') id: string,
  ): Promise<AvailableResolutionsVo> {
    const resolutions = await this.mediaService.getAvailableResolutions(id);
    return { resolutions };
  }
}
