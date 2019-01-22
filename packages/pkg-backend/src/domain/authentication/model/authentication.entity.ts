import { BaseEntity } from '@nestjs-bff/global/lib/entities/core/base.entity';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthenticationEntity extends BaseEntity {
  @IsNotEmpty()
  userId?: string;

  // @ValidateNested()
  local: LocalAuth | undefined;

  // @ValidateNested()
  google: GoogleAuth | undefined;

  // @ValidateNested()
  facebook: FacebookAuth | undefined;

  // @ValidateNested()
  twitter: TwitterAuth | undefined;
}

export class LocalAuth {
  @IsEmail()
  email?: string;

  @IsString()
  hashedPassword?: string;
}

export class GoogleAuth {
  @IsString()
  id?: string;

  @IsEmail()
  email?: string;

  @IsString()
  name?: string;
}

export class FacebookAuth {
  @IsString()
  id?: string;

  @IsString()
  name?: string;

  @IsEmail()
  email?: string;
}

export class TwitterAuth {
  @IsString()
  id?: string;

  @IsString()
  displayName?: string;

  @IsEmail()
  username?: string;
}
