import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsIn } from 'class-validator';

/**
 * 初始化上传请求DTO
 */
export class InitUploadRequest {
  @ApiProperty({ 
    description: '文件名',
    example: 'test-video.mp4'
  })
  @IsString()
  filename: string;

  @ApiProperty({ 
    description: '媒体类型',
    example: 'video',
    enum: ['video', 'audio', 'document', 'image']
  })
  @IsString()
  @IsIn(['video', 'audio', 'document', 'image'])
  mediaType: string;

  @ApiProperty({ 
    description: 'MIME类型',
    example: 'video/mp4'
  })
  @IsString()
  mimeType: string;

  @ApiProperty({ 
    description: '文件大小（字节）',
    example: 105341449
  })
  @IsNumber()
  fileSize: number;
}
