import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from '../service/file.service';
import { FileVo } from '../vo/file.vo';
import { InitUploadRequest } from '../dto/init-upload.request';
import { FileMapper } from '../mapper/file.mapper';
import { ApiBody, ApiConsumes, ApiOkResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';

@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private readonly fileMapper: FileMapper,
  ) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: '上传文件',
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiOkResponse({
    type: FileVo,
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    // 从请求中获取协议和主机名
    const protocol = req.protocol; // http 或 https
    const host = req.get('host'); // 获取当前主机名和端口（如 localhost:3000）

    return {
      url: `${protocol}://${host}${await this.fileService.simpleUpload(file)}`,
    };
  }

  @Post('init')
  initUpload(@Body() initUploadRequest: InitUploadRequest) {
    return this.fileService.initUpload(initUploadRequest);
  }

  @Post(':id/finish')
  async finishUpload(@Param('id') id: string): Promise<FileVo> {
    return this.fileMapper.toVo(await this.fileService.finishUpload(id));
  }

  @Get(':id')
  async get(@Param('id') id: string): Promise<FileVo> {
    return this.fileMapper.toVo(await this.fileService.get(id));
  }
}
