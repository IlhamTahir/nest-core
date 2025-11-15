import { Module } from '@nestjs/common';
import { CoreModule } from '@ilhamtahir/nest-core';
import { MediaModule } from './media/media.module';

@Module({
  imports: [CoreModule.forRoot(), MediaModule],
})
export class AppModule {}
