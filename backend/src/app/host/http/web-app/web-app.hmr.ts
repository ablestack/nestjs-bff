import { LoggerWinstonSharedService } from '@nestjs-bff/backend/lib/shared/logging/logger-winston.shared.service';
import { NestFactory } from '@nestjs/core';
import { AppConfig } from '../../../../config/app.config';
import { WebAppModule } from './web-app.module';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(WebAppModule, {
    logger: new LoggerWinstonSharedService(AppConfig),
  });
  await app.listen(3000);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
