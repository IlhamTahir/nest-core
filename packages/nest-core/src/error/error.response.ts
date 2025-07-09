import { ApiProperty } from '@nestjs/swagger';

export class ErrorResponse {
  @ApiProperty({ example: 400, description: '错误码' })
  code: number;

  @ApiProperty({
    description: '错误信息',
  })
  message: string;
}
