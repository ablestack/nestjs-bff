import { NestFactory } from '@nestjs/core';
import { WinstonLoggerService } from 'common/services/winstonlogger.service';
import { WebAppModule } from 'webapp.module';
import { ConfigService } from 'common/services/config.service';

async function bootstrap() {
  const app = await NestFactory.create(WebAppModule, {
    logger: new WinstonLoggerService(new ConfigService()),
  });
  await app.listen(3000);
}
bootstrap();
