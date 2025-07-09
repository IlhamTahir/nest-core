import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserBind } from '../entity/user-bind.entity';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';

@Injectable()
export class UserBindService {
  constructor(
    @InjectRepository(UserBind)
    private readonly userBindRepository: Repository<UserBind>,
  ) {}

  async findByTypeAndBindId(type: string, bindId: string) {
    return this.userBindRepository.findOne({
      where: { type, bindId },
      relations: ['user'],
    });
  }

  async create(user: User, type: string, bindId: string) {
    const userBind = this.userBindRepository.create({
      user,
      type,
      bindId,
    });
    return this.userBindRepository.save(userBind);
  }
}
