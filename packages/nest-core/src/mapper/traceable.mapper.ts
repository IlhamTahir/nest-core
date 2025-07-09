import { BaseMapper } from '../mapper/base.mapper';
import { TraceableEntity } from '../entity/traceable.entity';
import { UserMapper } from '../mapper/user.mapper';
import { TraceableVo } from '../vo/traceable.vo';

export class TraceableMapper<
  Entity extends TraceableEntity,
  Vo extends TraceableVo,
> extends BaseMapper<Entity, Vo> {
  async toVo(entity: Entity): Promise<Vo> {
    return {
      ...(await super.toVo(entity)),
      createBy: UserMapper.toVo(entity.createBy),
      updateBy: UserMapper.toVo(entity.updateBy),
    };
  }
}
