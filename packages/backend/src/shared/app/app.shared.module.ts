import { Module } from '@nestjs/common';
import { AppSysProviderTokens } from './app.shared.constants';

const NestjsBffConfigProvider = {
  provide: AppSysProviderTokens.Config.App,
  useFactory: () => {
    return global.nestjs_bff.AppConfig;
  },
};

@Module({
  imports: [],
  providers: [NestjsBffConfigProvider],
  exports: [NestjsBffConfigProvider],
})
export class AppSysModule {}
