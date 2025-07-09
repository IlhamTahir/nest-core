import { ApiProperty } from '@nestjs/swagger';
import { BaseVo } from '../vo/base.vo';

export class FileVo extends BaseVo {
  @ApiProperty()
  name: string;

  @ApiProperty()
  size: number;

  @ApiProperty()
  fileSum: string;

  @ApiProperty()
  url: string;
}
