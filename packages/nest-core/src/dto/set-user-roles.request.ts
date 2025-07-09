import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class SetUserRolesRequest {
  @ApiProperty({
    description: '角色ID列表',
    type: [String],
    example: ['role-id-1', 'role-id-2'],
  })
  @IsArray({ message: '角色列表必须是数组' })
  @IsString({ each: true, message: '角色ID必须是字符串' })
  roles: string[];
}
