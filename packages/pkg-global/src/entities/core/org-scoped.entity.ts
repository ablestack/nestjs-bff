import { BaseEntity } from './base.entity';
import { IsNotEmpty } from 'class-validator';

export abstract class OrgScopedEntity extends BaseEntity {
  @IsNotEmpty()
  public orgId: string | undefined = undefined;
}
