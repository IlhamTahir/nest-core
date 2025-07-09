import { Controller, Get } from '@nestjs/common';
import { CoreService } from '@ilhamtahir/nest-core';

@Controller()
export class AppController {
  constructor(
    private readonly coreService: CoreService,
  ) {}

  @Get()
  getHello(): string {
    return this.coreService.getHello();
  }

  @Get('app')
  getAppHello(): string {
    return 'Hello from NestJS Example App!';
  }

  @Get('info')
  getInfo() {
    return this.coreService.getInfo();
  }

  @Get('status')
  getStatus() {
    return {
      status: 'ok',
      service: 'NestJS Example App',
      coreModule: '@ilhamtahir/nest-core',
      features: [
        'Basic Core Service',
        'TypeScript Support',
        'NestJS Integration',
        'Workspace Development',
      ],
      timestamp: new Date().toISOString(),
    };
  }
}
