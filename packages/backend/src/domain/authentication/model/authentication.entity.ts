import { BaseEntity } from '@nestjs-bff/global/lib/entities/core/base.entity';
import { IsMongoId } from 'class-validator';

export class AuthenticationEntity extends BaseEntity {  
  @IsMongoId()
  userId?: string;

  local?: {
    email?: string;
    hashedPassword?: string;
  };

  google?: {
    id?: string;
    email?: string;
    name?: string;
  };

  facebook?: {
    id?: string;
    name?: string;
    email?: string;
  };

  twitter?: {
    id?: string;
    displayName?: string;
    username?: string;
  };
}
