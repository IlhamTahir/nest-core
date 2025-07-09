import { PageResult } from '../vo/page-result';

export class PageResultMapper {
  static toPageResult<T>(
    data: T[],
    page: number,
    size: number,
    total: number,
  ): PageResult<T> {
    return {
      data: data,
      pagination: {
        page: Number(page),
        size: Number(size),
        total,
      },
    };
  }
}
