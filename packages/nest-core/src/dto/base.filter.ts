import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, Matches } from 'class-validator';

export abstract class BaseFilter {
  @ApiProperty({ required: false, description: '分页页码', example: 1 })
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ required: false, description: '每页数量', example: 10 })
  @IsOptional()
  size?: number = 10;

  @ApiProperty({
    required: false,
    description: '排序字段和顺序，支持多个条件，例如 order[0]=+createdTime',
    isArray: true,
    example: ['+createdTime', '-username'],
  })
  @IsOptional()
  @IsArray()
  @Matches(/^[+-][a-zA-Z0-9_]+$/, {
    each: true,
    message: '排序条件必须以 "+" 或 "-" 开头，后跟字段名',
  })
  order?: string[] = ['-createdTime'];

  // 获取分页起始位置
  getSkip(): number {
    return (this.page - 1) * this.size;
  }

  // 获取分页大小
  getSize(): number {
    return this.size;
  }

  // 获取页码
  getPage(): number {
    return this.page;
  }

  // 获取查询条件（由子类实现）
  getConditions(): Record<string, any> {
    return {};
  }

  // 解析排序参数
  getOrderBy(): Record<string, 'ASC' | 'DESC'> {
    const orderConditions: Record<string, 'ASC' | 'DESC'> = {};
    if (this.order) {
      this.order.forEach((condition) => {
        const direction = condition.startsWith('+') ? 'ASC' : 'DESC';
        const field = condition.slice(1); // 移除第一个字符 (+ 或 -)
        orderConditions[field] = direction;
      });
    }
    return orderConditions;
  }
}
