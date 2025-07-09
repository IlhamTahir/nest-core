import { ErrorResponse } from './error.response';

export const FileError: Record<string, ErrorResponse> = {
  NOT_FOUND: {
    code: 6001,
    message: '文件未找到',
  },
  CANNOT_LOCK_SELF: {
    code: 6002,
    message: '用户无法禁用自己',
  },
};
