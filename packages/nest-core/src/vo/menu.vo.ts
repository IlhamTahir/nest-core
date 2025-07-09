import { BaseVo } from '../vo/base.vo';
import { } from '@nestjs/swagger';

export class MenuVo extends BaseVo {
  title: string;

  type: string;

  path: string;

  component: string;

  icon: string;

  redirect: string;

  hidden: boolean;

  keepAlive: boolean;

  order: number;

  enabled: boolean;

  parentId: string;

  permission: string;

  routerName: string;
}
