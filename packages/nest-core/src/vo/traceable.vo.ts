import { BaseVo } from './base.vo';
import { UserVo } from './user.vo';
import { ApiProperty } from '@nestjs/swagger';

export class TraceableVo extends BaseVo {
  @ApiProperty()
  createBy: UserVo | null;

  @ApiProperty()
  updateBy: UserVo | null;
}
