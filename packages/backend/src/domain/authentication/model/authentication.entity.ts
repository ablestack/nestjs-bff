import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { IsMongoId } from 'class-validator';

export class AuthenticationEntity implements IEntity {
  id?: any;
  
  @IsMongoId()
  public userId: string = '';

  local?: {
    email: string;
    hashedPassword: string;
  };

  google?: {
    id: string;
    email: string;
    name: string;
  };

  facebook?: {
    id: string;
    name: string;
    email: string;
  };

  twitter?: {
    id: string;
    displayName: string;
    username: string;
  };
}
