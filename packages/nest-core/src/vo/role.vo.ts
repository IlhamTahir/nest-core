import { BaseVo } from './base.vo';
import { ApiProperty } from '@nestjs/swagger';

export class RoleVo extends BaseVo {
  @ApiProperty()
  name: string;

  @ApiProperty()
  label: string;
  @ApiProperty()
  description?: string;
  @ApiProperty()
  isSystem: boolean;
}
