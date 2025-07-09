import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../service/user.service';
import { NO_AUTH_KEY } from '../decorators/no-auth.decorator';
import { JWT_SECRET } from '../constants/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly userService: UserService, // 注入 UserService
  ) {}
  async canActivate(context: ExecutionContext) {
    const isNoAuth = this.reflector.getAllAndOverride<boolean>(NO_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isNoAuth) {
      return true;
    }
    // 获取请求对象
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException('Missing authorization token');
    }
    try {
      // 验证并解析 JWT
      const payload = await this.jwtService.verifyAsync(token, {
        secret: JWT_SECRET,
      });

      // 从 UserService 加载用户（包含角色信息）
      const user = await this.userService.getUserWithRoles(payload.sub);
      if (!user) {
        throw new UnauthorizedException('用户未找到');
      }

      if (user.locked) {
        throw new UnauthorizedException('您已被禁用，请联系管理员');
      }

      // 将用户信息附加到请求对象
      this.userService.setCurrentUser(user);
      request.user = user;
      return true;
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
  private extractTokenFromHeader(request: any): string | null {
    const authHeader = request.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.split(' ')[1];
  }
}
