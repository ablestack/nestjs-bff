import { IsString, IsInt } from 'class-validator';

export class CreateCatDto {
  @IsString() public readonly name: string;

  @IsInt() public readonly age: number;

  @IsString() public readonly breed: string;
}
