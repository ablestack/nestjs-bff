import { IsNotEmpty } from 'class-validator';

export class PromoteToGroupAdminCommand {
  @IsNotEmpty()
  public readonly userId: string = '';
}
