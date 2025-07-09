import { ApiProperty } from '@nestjs/swagger';

export abstract class BaseVo {
  @ApiProperty()
  id: string;
  @ApiProperty()
  createdTime: string;
  @ApiProperty()
  updatedTime: string;
}
