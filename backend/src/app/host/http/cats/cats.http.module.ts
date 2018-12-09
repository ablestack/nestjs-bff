import { AuthorizationDomainModule } from '@nestjs-bff/backend/lib/domain/authorization/authorization.domain.module';
import { CoreHttpModule } from '@nestjs-bff/backend/lib/host/http/core/core.http.module';
import { Module } from '@nestjs/common';
import { CatsDomainModule } from '../../../domain/cats/cats.domain.module';
import { CatsHttpController } from './cats.http.controller';

@Module({
  imports: [CoreHttpModule, CatsDomainModule, AuthorizationDomainModule],
  controllers: [CatsHttpController],
  providers: [],
  exports: [],
})
export class CatsHttpModule {}
