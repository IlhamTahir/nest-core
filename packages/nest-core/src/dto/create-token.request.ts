import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IsUsernameOrEmail } from '../decorators/custom-validator';

export class CreateTokenRequest {
  @ApiProperty({
    required: true,
    example: 'admin',
  })
  @IsNotEmpty({ message: '用户名或邮箱不能为空' })
  @IsUsernameOrEmail({
    message:
      'identifier 必须是有效的邮箱或用户名（3-20 个字符，字母、数字、下划线）',
  })
  identifier: string;

  @IsNotEmpty({ message: '密码不能为空' })
  @ApiProperty({
    required: true,
    example: 'admin123',
  })
  password: string;
}
