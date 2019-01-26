import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
export class CreateOrganizationMemberCommand {
  @IsNotEmpty()
  public readonly orgId: string = '';

  @IsEmail()
  @Length(6, 64)
  public readonly username: string = '';

  @IsString()
  @Length(1, 32)
  public readonly displayName: string = '';

  @IsString()
  @Length(8, 64)
  public readonly password: string = '';
}
