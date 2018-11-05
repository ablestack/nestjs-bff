import { LoggerWinstonSysService } from '@nestjs-bff/backend/shared/logging/logger-winston.shared.service';
import { NestFactory } from '@nestjs/core';
import { AppConfig } from 'config/app.config';
import { WebAppHttpModule } from './web-app.http.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(WebAppHttpModule, {
    logger: new LoggerWinstonSysService(AppConfig),
  });
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
