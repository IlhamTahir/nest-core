import { BaseMapper } from '../mapper/base.mapper';
import { FileVo } from '../vo/file.vo';
import { File } from '../entity/file.entity';
import { UploadManager } from '../service/upload-manager';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FileMapper extends BaseMapper<File, FileVo> {
  constructor(private uploadManager: UploadManager) {
    super();
  }

  async toVo(entity: File): Promise<FileVo> {
    return {
      ...(await super.toVo(entity)),
      name: entity.name,
      size: entity.size,
      fileSum: entity.fileSum,
      url: await this.uploadManager
        .getStrategy('s3')
        .generateUrl(entity.fileSum),
    };
  }
}
