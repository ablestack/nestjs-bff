import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { CommonModule } from '../common/common.module';
import { ConfigService } from 'common/services/config.service';

@Module({
  imports: [CommonModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ConfigService], // import Config Service directly instead of via CommonModule to avoid circular dependency
  exports: [JwtStrategy],
})
export class AuthModule {}
