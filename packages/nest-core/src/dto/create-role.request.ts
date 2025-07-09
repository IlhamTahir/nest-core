import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class CreateRoleRequest {
  @ApiProperty()
  @IsNotEmpty({ message: '角色名称不能为空' })
  @Matches(/^[A-Z]+(_[A-Z]+)*$/, {
    message: '角色名称格式不正确，应为大写英文并用下划线分隔，例如：ROLE_ADMIN',
  })
  name: string;

  @IsNotEmpty({ message: '角色标识不能为空' })
  @ApiProperty()
  label: string;
}
