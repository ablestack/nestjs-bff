import { IsBoolean, IsString } from 'class-validator';

export class AddTodoItemCommand {
  @IsString()
  public readonly title: string = '';
  @IsBoolean()
  public readonly complete: boolean = false;
}
