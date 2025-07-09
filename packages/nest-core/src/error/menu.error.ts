import { ErrorResponse } from './error.response';

enum MenuError {
  NOT_FOUND = 'NOT_FOUND',
  HAS_CHILDREN = 'HAS_CHILDREN',
}

export const menuError: Record<MenuError, ErrorResponse> = {
  NOT_FOUND: {
    code: 1001,
    message: '菜单不存在',
  },
  HAS_CHILDREN: {
    code: 1002,
    message: '菜单有子菜单，不能删除',
  },
};
