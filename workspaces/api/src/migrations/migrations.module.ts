import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MigrationsService } from './migrations.service';
import { MigrationSchema } from './schemas/migration.schema';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule, MongooseModule.forFeature([{ name: 'Migration', schema: MigrationSchema }])],
  providers: [MigrationsService],
})
export class MigrationsModule {}
