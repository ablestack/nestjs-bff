import { BaseEntity } from '@nestjs-bff/global/lib/entities/core/base.entity';
import { IsEmail, IsMongoId, IsString, ValidateNested } from 'class-validator';

export class AuthenticationEntity extends BaseEntity {
  @IsMongoId()
  userId?: string;

  @ValidateNested()
  local?: Local;

  @ValidateNested()
  google?: Google;

  @ValidateNested()
  facebook?: Facebook;

  @ValidateNested()
  twitter?: Twitter;
}

class Local {
  @IsEmail()
  email?: string;

  @IsString()
  hashedPassword?: string;
}

class Google {
  @IsString()
  id?: string;

  @IsEmail()
  email?: string;

  @IsString()
  name?: string;
}

class Facebook {
  @IsString()
  id?: string;

  @IsString()
  name?: string;

  @IsEmail()
  email?: string;
}

class Twitter {
  @IsString()
  id?: string;

  @IsString()
  displayName?: string;

  @IsEmail()
  username?: string;
}
