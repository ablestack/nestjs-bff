import {
  CACHE_MANAGER,
  CacheModule as NestCacheModule,
  CacheStore,
  Module,
} from '@nestjs/common';
import { CachingProviderTokens } from './caching.shared.constants';

const CacheModule = NestCacheModule.register({
  ttl: 20, // seconds
  max: 1000, // max number of items in cache
});

const CacheStoreProvider = {
  provide: CachingProviderTokens.Services.CacheStore,
  useFactory: (cacheStore: CacheStore): CacheStore => {
    return cacheStore;
  },
  inject: [CACHE_MANAGER],
};

@Module({
  imports: [CacheModule],
  providers: [CacheStoreProvider],
  exports: [CacheModule, CacheStoreProvider],
})
export class CachingSharedModule {}
