import { Role } from '../entity/role.entity';
import { RoleVo } from '../vo/role.vo';

export class RoleMapper {
  static toVo(entity: Role): RoleVo {
    const vo = new RoleVo();
    vo.id = entity.id;
    vo.name = entity.name;
    vo.label = entity.label;
    vo.description = entity.description;
    vo.isSystem = entity.isSystem;
    vo.createdTime = entity.createdTime?.toISOString();
    vo.updatedTime = entity.updatedTime?.toISOString();
    return vo;
  }
}
