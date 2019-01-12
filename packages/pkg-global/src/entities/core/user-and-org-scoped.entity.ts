import { OrgScopedEntity } from './org-scoped.entity';
import { IsNotEmpty } from 'class-validator';

export abstract class UserAndOrgScopedEntity extends OrgScopedEntity {
  @IsNotEmpty()
  public userId: string | undefined = undefined;
}
