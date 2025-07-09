import { ApiProperty } from '@nestjs/swagger';

export class TokenVo {
  @ApiProperty()
  token: string;
}
