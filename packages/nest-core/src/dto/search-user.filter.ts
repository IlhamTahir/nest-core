import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { BaseFilter } from './base.filter';
import { Like } from 'typeorm';

export class SearchUserFilter extends BaseFilter {
  @ApiProperty({ required: false, description: '用户名搜索关键字' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ required: false, description: '用户编号' })
  @IsOptional()
  @IsString()
  userIdentifier?: string;

  @ApiProperty({ required: false, description: '邮箱' })
  @IsOptional()
  @IsString()
  email?: string;

  getConditions(): Record<string, any> {
    const conditions: Record<string, any> = {};
    if (this.username) {
      conditions.username = Like(`%${this.username}%`);
    }
    if (this.userIdentifier) {
      conditions.userIdentifier = Number(this.userIdentifier);
    }
    if (this.email) {
      conditions.email = Like(`%${this.email}%`);
    }
    return conditions;
  }

  getOrderBy(): Record<string, 'ASC' | 'DESC'> {
    return {
      createdTime: 'DESC',
    };
  }
}
