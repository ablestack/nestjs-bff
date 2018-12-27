import { IsMongoId } from 'class-validator';

export class ReminderQueryConditions {
  @IsMongoId()
  public userId: string = '';

  @IsMongoId()
  public readonly orgId: string = '';
}
