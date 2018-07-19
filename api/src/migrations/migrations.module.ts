import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MigrationsService } from './migrations.service';
import { MigrationSchema } from './schemas/migration.schema';
import { CommonModule } from '../common/common.module';
import { migrationsProviders } from './migrations.provider';

@Module({
  imports: [CommonModule],
  providers: [MigrationsService, ...migrationsProviders],
})
export class MigrationsModule {}
