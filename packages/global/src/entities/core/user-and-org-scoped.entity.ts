import { OrgScopedEntity } from './org-scoped.entity';
import { IsMongoId } from 'class-validator';

export abstract class UserAndOrgScopedEntity extends OrgScopedEntity {
  @IsMongoId()
  public userId?: string;
}
