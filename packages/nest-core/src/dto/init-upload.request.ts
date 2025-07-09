import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class InitUploadRequest {
  @ApiProperty()
  @IsNotEmpty({ message: '文件名称不能为空' })
  fileName: string;

  @ApiProperty()
  @IsNotEmpty({ message: '文件类型不能为空' })
  mineType: string;

  @ApiProperty()
  @IsNotEmpty({ message: '文件校验码不能为空' })
  fileSum: string;

  @ApiProperty()
  @IsNotEmpty({ message: '文件大小不能为空' })
  size: number;
}
