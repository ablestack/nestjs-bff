import { Module } from '@nestjs/common';
import { AppSharedProviderTokens } from './app.shared.constants';

const NestjsBffConfigProvider = {
  provide: AppSharedProviderTokens.Config.App,
  useFactory: () => {
    // @ts-ignore
    return global.nestjs_bff.AppConfig;
  },
};

@Module({
  imports: [],
  providers: [NestjsBffConfigProvider],
  exports: [NestjsBffConfigProvider],
})
export class AppSharedModule {}
