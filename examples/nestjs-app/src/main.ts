import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  console.log('🚀 NestJS Example App is running on: http://localhost:3000');
  console.log('📦 Using @ilhamtahir/nest-core package');
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
