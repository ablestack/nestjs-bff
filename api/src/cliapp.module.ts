import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MigrationsModule } from 'migrations/migrations.module';
import { ConfigService } from '../common/services/config.service';

const configService = new ConfigService();
@Module({
  imports: [MongooseModule.forRoot(configService.mongoConnectionUri), MigrationsModule],
  controllers: [],
  providers: [],
})
export class CliAppModule {}
