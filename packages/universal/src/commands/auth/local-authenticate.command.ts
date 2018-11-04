import { IsEmail, IsString, Length } from 'class-validator';

export class LocalAuthenticateCommand {
  @IsEmail()
  @Length(6, 64)
  public readonly username: string = '';

  @IsString()
  @Length(8, 32)
  public readonly password: string = '';
}
