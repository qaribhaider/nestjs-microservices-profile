import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('HTTP_PORT'), () => {
    Logger.log(`Auth service started on port ${configService.get('HTTP_PORT')}`);
  });
}
bootstrap();
