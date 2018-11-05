import { IsInt, IsString } from 'class-validator';

export class CreateCatCommand {
  @IsString()
  public readonly name: string = '';
  @IsInt()
  public readonly age: number = -1;
  @IsString()
  public readonly breed: string = '';
}
