import { ApiProperty } from '@nestjs/swagger';
import { MediaStatus } from '../media.entity';

/**
 * 初始化上传响应VO
 */
export class InitUploadVo {
  @ApiProperty({ description: '媒体ID' })
  mediaId: string;

  @ApiProperty({ description: '上传URL' })
  uploadUrl: string;

  @ApiProperty({ description: 'OSS存储桶' })
  bucket: string;

  @ApiProperty({ description: '文件key' })
  key: string;
}

/**
 * 媒体详情响应VO
 */
export class MediaDetailVo {
  @ApiProperty({ description: '媒体ID' })
  id: string;

  @ApiProperty({ description: '文件名' })
  filename: string;

  @ApiProperty({ description: '原始文件URL' })
  originUrl: string;

  @ApiProperty({ 
    description: '处理状态',
    enum: MediaStatus
  })
  status: MediaStatus;

  @ApiProperty({ description: '媒体类型' })
  mediaType: string;

  @ApiProperty({ description: 'MIME类型' })
  mimeType: string;

  @ApiProperty({ description: '时长（秒）', required: false })
  duration?: number;

  @ApiProperty({ description: '宽度', required: false })
  width?: number;

  @ApiProperty({ description: '高度', required: false })
  height?: number;

  @ApiProperty({ description: '文件大小（字节）' })
  fileSize: number;

  @ApiProperty({ 
    description: '可用分辨率列表',
    example: ['720p', '1080p'],
    required: false
  })
  resolutions?: string[];

  @ApiProperty({ description: '缩略图URL', required: false })
  thumbnailUrl?: string;

  @ApiProperty({ description: '预览URL', required: false })
  previewUrl?: string;

  @ApiProperty({ description: '错误原因', required: false })
  errorReason?: string;

  @ApiProperty({ description: '创建时间' })
  createdTime: string;

  @ApiProperty({ description: '更新时间' })
  updatedTime: string;
}

/**
 * 播放Token响应VO
 */
export class PlayTokenVo {
  @ApiProperty({ 
    description: '带token的播放URL',
    example: 'https://cdn.example.com/video/720p/index.m3u8?token=eyJ...'
  })
  playUrl: string;
}

/**
 * 可用分辨率响应VO
 */
export class AvailableResolutionsVo {
  @ApiProperty({ 
    description: '可用分辨率列表',
    example: ['720p', '1080p']
  })
  resolutions: string[];
}
