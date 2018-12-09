import { MigrationsSharedModule } from '@nestjs-bff/backend/lib/shared/migrations/migrations.shared.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [MigrationsSharedModule],
  controllers: undefined,
  providers: undefined,
  exports: undefined,
})
export class CliAppModule {}
