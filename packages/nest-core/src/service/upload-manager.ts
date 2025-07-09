import { Injectable } from '@nestjs/common';
import { UploadStrategy } from './strategy/upload-strategy.interface';

@Injectable()
export class UploadManager {
  private strategies: { [key: string]: UploadStrategy } = {};

  registerStrategy(name: string, strategy: UploadStrategy): void {
    this.strategies[name] = strategy;
  }

  getStrategy(name: string): UploadStrategy {
    const strategy = this.strategies[name];
    if (!strategy) {
      throw new Error(`未注册的上传策略: ${name}`);
    }
    return strategy;
  }
}
