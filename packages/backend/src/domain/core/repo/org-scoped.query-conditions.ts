import { IsMongoId } from 'class-validator';

export class OrgScopedQueryConditions {
  @IsMongoId()
  public readonly orgId: string = '';
}
