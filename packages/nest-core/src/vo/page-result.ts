import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
@ApiExtraModels()
export class PageResult<T> {
  @ApiProperty({ isArray: true, description: '分页数据' })
  data: T[];

  @ApiProperty({
    description: '分页信息',
    type: 'object',
    properties: {
      page: { type: 'number', example: 1 },
      size: { type: 'number', example: 10 },
      total: { type: 'number', example: 100 },
    },
  })
  pagination: {
    page: number;
    size: number;
    total: number;
  };
}
