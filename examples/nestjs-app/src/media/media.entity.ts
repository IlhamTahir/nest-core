import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@ilhamtahir/nest-core';

/**
 * 媒体状态枚举
 */
export enum MediaStatus {
  /** 待处理 */
  PENDING = 'pending',
  
  /** 处理中 */
  PROCESSING = 'processing',
  
  /** 处理成功 */
  SUCCESS = 'success',
  
  /** 处理失败 */
  FAILED = 'failed',
}

/**
 * 媒体实体 - 统一管理媒体文件
 * 支持上传、转码、多码率、安全播放
 */
@Entity()
export class Media extends BaseEntity {
  @Column({ type: 'varchar', length: 255, comment: '原始文件名' })
  filename: string;

  @Column({ type: 'varchar', length: 500, comment: 'OSS原始文件地址' })
  originUrl: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    comment: '原始文件ID（关联File表）',
  })
  originalFileId?: string;

  @Column({
    type: 'enum',
    enum: MediaStatus,
    default: MediaStatus.PENDING,
    comment: '媒体处理状态',
  })
  status: MediaStatus;

  @Column({
    type: 'varchar',
    length: 100,
    comment: '媒体类型（video/audio/document）',
  })
  mediaType: string;

  @Column({ type: 'varchar', length: 50, comment: 'MIME类型' })
  mimeType: string;

  @Column({
    type: 'int',
    nullable: true,
    comment: '时长（秒），适用于视频/音频',
  })
  duration?: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: '宽度（像素），适用于视频/图片',
  })
  width?: number;

  @Column({
    type: 'int',
    nullable: true,
    comment: '高度（像素），适用于视频/图片',
  })
  height?: number;

  @Column({ type: 'bigint', comment: '文件大小（字节）' })
  fileSize: number;

  @Column({ type: 'json', nullable: true, comment: '成功转码的分辨率列表' })
  resolutions?: string[];

  @Column({
    type: 'json',
    nullable: true,
    comment: '每个分辨率的播放链接及Token',
  })
  tokenMap?: {
    [resolution: string]: string; // HLS播放地址
  };

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '缩略图URL',
  })
  thumbnailUrl?: string;

  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    comment: '预览URL（低分辨率）',
  })
  previewUrl?: string;

  @Column({
    type: 'text',
    nullable: true,
    comment: '处理失败的错误原因',
  })
  errorReason?: string;

  @Column({ type: 'varchar', length: 50, comment: '创建者ID' })
  creatorId: string;
}
