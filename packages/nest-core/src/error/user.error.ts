import { ErrorResponse } from './error.response';

export const UserError: Record<string, ErrorResponse> = {
  NOT_FOUND: {
    code: 1001,
    message: '用户未找到',
  },
  CANNOT_LOCK_SELF: {
    code: 1002,
    message: '用户无法禁用自己',
  },
};
