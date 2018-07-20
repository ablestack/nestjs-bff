import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { CommonModule } from '../common/common.module';
import { AuthModule } from '../auth/auth.module';
import { catsProvider } from './cats.provider';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule, CommonModule, AuthModule],
  controllers: [CatsController],
  providers: [CatsService, catsProvider],
})
export class CatsModule {}
