import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateTokenRequest } from '../dto/create-token.request';
import * as bcrypt from 'bcryptjs';
import { TokenVo } from '../vo/token.vo';
import { JWT_SECRET } from '../constants/jwt';
import { User } from '../entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async createToken(tokenCreateRequest: CreateTokenRequest) {
    const user = await this.userService.findByIdentifier(
      tokenCreateRequest.identifier,
    );

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    // 验证密码
    const isPasswordValid = await bcrypt.compare(
      tokenCreateRequest.password,
      user.encryptedPassword,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }
    return await this.generateToken(user);
  }

  async generateToken(user: User) {
    const payload = { sub: user.id, username: user.username }; // payload 中包含用户 ID 和用户名
    const tokenVo = new TokenVo();
    try {
      tokenVo.token = await this.jwtService.signAsync(payload, {
        secret: JWT_SECRET,
      });
    } catch (e) {
      throw new UnauthorizedException('token生成失败');
    }
    return tokenVo;
  }
}
