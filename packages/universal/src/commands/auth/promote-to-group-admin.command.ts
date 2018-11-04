import { IsMongoId } from 'class-validator';

export class PromoteToGroupAdminCommand {
  @IsMongoId()
  public readonly userId: string = '';
}
