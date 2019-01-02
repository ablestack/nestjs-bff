import { IsNotEmpty, IsString } from 'class-validator';
import { BaseQueryConditions } from '../../core/repo/query-conditions/base.query-conditions';

export class OrganizationQueryConditions extends BaseQueryConditions {
  @IsString()
  @IsNotEmpty()
  public slug: string = '';
}
