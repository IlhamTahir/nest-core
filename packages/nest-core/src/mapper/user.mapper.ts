import { User } from '../entity/user.entity';
import { UserVo } from '../vo/user.vo';
import { DateUtil } from '../util/date.util';

export class UserMapper {
  static toVo(entity?: User): UserVo {
    if (!entity) return null;
    return {
      id: entity.id,
      userIdentifier: entity.userIdentifier,
      username: entity.username,
      email: entity.email,
      emailVerified: entity.emailVerified,
      locked: entity.locked,
      enabled: entity.enabled,
      createdTime: DateUtil.format(entity.createdTime),
      updatedTime: DateUtil.format(entity.updatedTime),
      roles: entity.roles ? entity.roles.map((item) => item.label) : [],
      roleIds: entity.roles ? entity.roles.map((item) => item.id) : [],
    };
  }
  static toVos(entities: User[]): UserVo[] {
    return entities.map((entity) => this.toVo(entity));
  }
}
