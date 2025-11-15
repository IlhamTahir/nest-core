import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Media, MediaStatus } from './media.entity';
import { InitUploadRequest } from './dto/init-upload.request';
import { InitUploadVo, MediaDetailVo } from './vo/media.vo';
import * as crypto from 'crypto';

/**
 * 媒体服务
 * 处理媒体上传、转码、播放Token等功能
 */
@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly configService: ConfigService,
  ) {}

  /**
   * 初始化媒体上传
   * 创建媒体记录并返回上传信息
   */
  async initUpload(
    data: InitUploadRequest,
    creatorId: string,
  ): Promise<InitUploadVo> {
    // 生成唯一的文件key
    const fileKey = this.generateFileKey(data.filename, data.mediaType);
    const originUrl = this.generateOriginUrl(fileKey);

    // 创建媒体记录
    const media = this.mediaRepository.create({
      filename: data.filename,
      originUrl,
      status: MediaStatus.PENDING,
      mediaType: data.mediaType,
      mimeType: data.mimeType,
      fileSize: data.fileSize,
      creatorId,
    });

    const savedMedia = await this.mediaRepository.save(media);

    // 生成上传URL（这里模拟OSS STS授权）
    const uploadUrl = this.generateUploadUrl(fileKey);

    // 如果是视频文件，自动添加到转码队列
    if (data.mediaType === 'video') {
      await this.addToTranscodeQueue(savedMedia);
    }

    return {
      mediaId: savedMedia.id,
      uploadUrl,
      bucket: this.configService.get('OSS_BUCKET', 'default-bucket'),
      key: fileKey,
    };
  }

  /**
   * 获取媒体详情
   */
  async getMediaDetail(mediaId: string): Promise<MediaDetailVo> {
    const media = await this.mediaRepository.findOne({
      where: { id: mediaId },
    });

    if (!media) {
      throw new NotFoundException('媒体不存在');
    }

    return {
      id: media.id,
      filename: media.filename,
      originUrl: media.originUrl,
      status: media.status,
      mediaType: media.mediaType,
      mimeType: media.mimeType,
      duration: media.duration,
      width: media.width,
      height: media.height,
      fileSize: media.fileSize,
      resolutions: media.resolutions,
      thumbnailUrl: media.thumbnailUrl,
      previewUrl: media.previewUrl,
      errorReason: media.errorReason,
      createdTime: media.createdTime.toISOString(),
      updatedTime: media.updatedTime.toISOString(),
    };
  }

  /**
   * 生成文件key
   */
  private generateFileKey(filename: string, mediaType: string): string {
    const timestamp = Date.now();
    const randomStr = crypto.randomBytes(8).toString('hex');
    const ext = filename.split('.').pop();
    return `${mediaType}/${timestamp}_${randomStr}.${ext}`;
  }

  /**
   * 生成原始文件URL
   */
  private generateOriginUrl(fileKey: string): string {
    const bucket = this.configService.get('OSS_BUCKET', 'default-bucket');
    const endpoint = this.configService.get('OSS_ENDPOINT', 'https://oss.example.com');
    return `${endpoint}/${bucket}/${fileKey}`;
  }

  /**
   * 生成上传URL（模拟OSS STS授权）
   */
  private generateUploadUrl(fileKey: string): string {
    const bucket = this.configService.get('OSS_BUCKET', 'default-bucket');
    const endpoint = this.configService.get('OSS_ENDPOINT', 'https://oss.example.com');
    
    // 在实际实现中，这里应该调用OSS SDK生成带签名的上传URL
    // 这里只是模拟返回一个上传URL
    const token = crypto.randomBytes(32).toString('hex');
    return `${endpoint}/${bucket}/${fileKey}?uploadToken=${token}&expires=${Date.now() + 3600000}`;
  }

  /**
   * 添加到转码队列（模拟）
   */
  private async addToTranscodeQueue(media: Media): Promise<void> {
    // 在实际实现中，这里应该将任务添加到消息队列
    console.log(`添加媒体 ${media.id} 到转码队列`);
    
    // 模拟异步处理
    setTimeout(async () => {
      await this.mediaRepository.update(media.id, {
        status: MediaStatus.PROCESSING,
      });
      console.log(`媒体 ${media.id} 开始处理`);
    }, 1000);
  }

  /**
   * 获取播放Token（模拟）
   */
  async getPlayToken(mediaId: string, resolution?: string): Promise<string> {
    const media = await this.mediaRepository.findOne({
      where: { id: mediaId },
    });

    if (!media) {
      throw new NotFoundException('媒体不存在');
    }

    if (media.status !== MediaStatus.SUCCESS) {
      throw new BadRequestException('媒体尚未处理完成');
    }

    // 生成播放Token（模拟）
    const token = crypto.randomBytes(32).toString('hex');
    const playUrl = `https://cdn.example.com/video/${resolution || '720p'}/index.m3u8?token=${token}`;
    
    return playUrl;
  }

  /**
   * 获取可用分辨率
   */
  async getAvailableResolutions(mediaId: string): Promise<string[]> {
    const media = await this.mediaRepository.findOne({
      where: { id: mediaId },
    });

    if (!media) {
      throw new NotFoundException('媒体不存在');
    }

    return media.resolutions || [];
  }
}
