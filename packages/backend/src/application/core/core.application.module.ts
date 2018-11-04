import { Module } from '@nestjs/common';
import { AppSysModule } from '../../shared/app/app.shared.module';

@Module({
  imports: [AppSysModule],
  providers: [],
  exports: [AppSysModule],
})
export class CoreApplicationModule {}
