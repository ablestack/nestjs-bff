import { IsBoolean, IsString } from 'class-validator';

export class CreateTodoCommand {
  @IsString()
  public readonly title: string = '';
  @IsBoolean()
  public readonly complete: boolean = false;
}
