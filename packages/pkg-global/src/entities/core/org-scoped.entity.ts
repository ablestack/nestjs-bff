import { BaseEntity } from './base.entity';
import { IsMongoId } from 'class-validator';

export abstract class OrgScopedEntity extends BaseEntity {
  @IsMongoId()
  public orgId: string | undefined = undefined;
}
