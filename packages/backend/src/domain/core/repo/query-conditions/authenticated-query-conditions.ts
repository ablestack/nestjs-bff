import { IsMongoId } from 'class-validator';

export class AuthenticatedQueryConditions {
  @IsMongoId()
  public userId: string = '';

  @IsMongoId()
  public readonly orgId: string = '';
}
