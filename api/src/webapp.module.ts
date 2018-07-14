import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CatsModule } from 'cats/cats.module';
import { WebAppController } from 'webapp.controller';
import { WebAppHealthCheckService } from 'webAppHealthCheck.service';

@Module({
  imports: [AuthModule, MongooseModule.forRoot('mongodb://localhost/nestjs-bff'), CatsModule],
  controllers: [WebAppController],
  providers: [WebAppHealthCheckService],
})
export class WebAppModule {}
