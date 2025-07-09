import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsString } from 'class-validator';

export class AssignRoleMenusRequest {
  @ApiProperty({
    description: '菜单ID列表',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  menuIds: string[];
}
