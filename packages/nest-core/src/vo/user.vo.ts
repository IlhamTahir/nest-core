import { BaseVo } from './base.vo';
import { ApiProperty } from '@nestjs/swagger';

export class UserVo extends BaseVo {
  @ApiProperty()
  userIdentifier: number;

  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  roles: string[];

  @ApiProperty()
  roleIds: string[];

  @ApiProperty()
  emailVerified: boolean;

  @ApiProperty()
  locked: boolean;
  @ApiProperty()
  enabled: boolean;
}
