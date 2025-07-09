import { IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserRequest {
  @IsNotEmpty({ message: '用户名不能为空' })
  @ApiProperty()
  username: string;

  @IsNotEmpty({ message: '邮箱不能为空' })
  @IsEmail({}, { message: '邮箱格式不正确' })
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @ApiProperty()
  password: string;
}
