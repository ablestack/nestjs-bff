import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MigrationsModule } from 'migrations/migrations.module';

@Module({
  imports: [MigrationsModule],
  controllers: [],
  providers: [],
})
export class CliAppModule {}
