import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(configService.get('HTTP_PORT'), () => {
    Logger.log(`Auth service started on port ${configService.get('HTTP_PORT')}`);
  });
}
bootstrap();
