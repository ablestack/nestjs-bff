import { Module } from '@nestjs/common';
import { AppSharedModule } from '../../shared/app/app.shared.module';

@Module({
  imports: [AppSharedModule],
  providers: [],
  exports: [AppSharedModule],
})
export class CoreModule {}
