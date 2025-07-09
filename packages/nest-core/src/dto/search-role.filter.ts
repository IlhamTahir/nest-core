import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseFilter } from './base.filter';
import { Like } from 'typeorm';

export class SearchRoleFilter extends BaseFilter {
  @ApiProperty({ required: false, description: '角色名称搜索关键字' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false, description: '角色标签搜索关键字' })
  @IsOptional()
  @IsString()
  label?: string;

  getConditions(): Record<string, any> {
    const conditions: Record<string, any> = {};
    if (this.name) {
      conditions.name = Like(`%${this.name}%`);
    }
    if (this.label) {
      conditions.label = Like(`%${this.label}%`);
    }
    return conditions;
  }

  getOrderBy(): Record<string, 'ASC' | 'DESC'> {
    return {
      createdTime: 'DESC',
    };
  }
}
