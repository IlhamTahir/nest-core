import { BaseEntity } from '../entity/base.entity';
import { BaseVo } from '../vo/base.vo';
import { DateUtil } from '../util/date.util';

export abstract class BaseMapper<Entity extends BaseEntity, Vo extends BaseVo> {
  async toVo(entity: Entity): Promise<Vo> {
    if (!entity) return null;
    return {
      id: entity.id,
      createdTime: DateUtil.format(entity.createdTime),
      updatedTime: DateUtil.format(entity.updatedTime),
    } as Vo;
  }

  async toVos(entities: Entity[]): Promise<Vo[]> {
    return Promise.all(entities.map((entity) => this.toVo(entity)));
  }
}
