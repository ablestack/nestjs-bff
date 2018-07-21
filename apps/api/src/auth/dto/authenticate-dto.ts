import { IsString } from 'class-validator';

export class AuthenticateDto {
  @IsString() public readonly username: string;

  @IsString() public readonly password: string;
}
