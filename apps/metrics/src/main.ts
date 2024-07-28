import { NestFactory } from '@nestjs/core';
import { MetricsModule } from './metrics.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(MetricsModule);
  const configService = app.get(ConfigService);
  await app.listen(configService.get('HTTP_PORT'), () => {
    Logger.log(`Service started on port ${configService.get('HTTP_PORT')}`);
  });
}
bootstrap();
