import { MigrationsSysModule } from '@nestjs-bff/backend/shared/migrations/migrations.shared.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [MigrationsSysModule],
  controllers: undefined,
  providers: undefined,
  exports: undefined,
})
export class CliAppModule {}
