import { Injectable } from '@nestjs/common';
import { UploadManager } from '../service/upload-manager';
import { File } from '../entity/file.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileStatus } from '../enum/file-status.enum';
import { InitUploadRequest } from '../dto/init-upload.request';
import { BizException } from '../exception/biz.exception';
import { FileError } from '../error/file.error';
import * as dotenv from 'dotenv';

import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { generateUniqueKey } from '../util/str';

// 定义恢复上传的返回类型
interface ResumeUploadResult {
  completedParts: { partNumber: number; eTag: string }[];
}

dotenv.config();

@Injectable()
export class FileService {
  constructor(
    private readonly uploadManager: UploadManager,
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
  ) {}

  /**
   * 初始化上传
   */
  async initUpload(initUploadRequest: InitUploadRequest): Promise<any> {
    const strategy = this.uploadManager.getStrategy('s3');
    const result = await strategy.initUpload();

    const file = this.fileRepository.create({
      name: initUploadRequest.fileName,
      size: initUploadRequest.size,
      mineType: initUploadRequest.mineType,
      fileSum: initUploadRequest.fileSum,
      path: 'upload',
      provider: 's3',
    });
    const saved = await this.fileRepository.save(file);
    return {
      ...result,
      fileId: saved.id,
      fileSum: saved.fileSum,
    };
  }

  /**
   * 恢复上传
   */
  async resumeUpload(
    uploadId: string,
    bucket: string,
    provider: string,
  ): Promise<ResumeUploadResult> {
    const strategy = this.uploadManager.getStrategy(provider);
    return strategy.resumeUpload(uploadId, bucket);
  }

  async get(id: string): Promise<File> {
    const file = await this.fileRepository.findOneBy({ id });
    if (!file) {
      throw new BizException(FileError.NOT_FOUND);
    }
    return file;
  }

  /**
   * 完成上传
   */
  async finishUpload(id: string): Promise<File> {
    const file = await this.get(id);
    file.status = FileStatus.UPLOADED;
    return this.fileRepository.save(file);
  }
  private readonly uploadDir =
    process.env.NODE_ENV === 'production'
      ? join(process.cwd(), process.env.UPLOAD_DIR || 'uploads')
      : join(__dirname, '../../../', process.env.UPLOAD_DIR || 'uploads'); // 上传文件保存目录

  async simpleUpload(file: Express.Multer.File): Promise<string> {
    console.log('Upload directory:', this.uploadDir);
    console.log('NODE_ENV:', process.env.NODE_ENV);
    console.log('Current working directory:', process.cwd());

    // 确保上传目录存在
    if (!existsSync(this.uploadDir)) {
      console.log('Creating upload directory:', this.uploadDir);
      mkdirSync(this.uploadDir, { recursive: true });
    }

    // 生成唯一文件名
    const uniqueFileName = generateUniqueKey(file.originalname || 'unknown');
    const filePath = join(this.uploadDir, uniqueFileName);

    console.log('Saving file to:', filePath);

    // 保存文件到本地
    writeFileSync(filePath, file.buffer);

    console.log('File saved successfully');

    // 返回本地访问地址
    return `/uploads/${uniqueFileName}`;
  }
}
