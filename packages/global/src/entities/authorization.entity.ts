import { Roles, OrganizationRoles } from '../constants/roles.constants';
import { BaseEntity } from './core/base.entity';
import { IsMongoId, IsArray, ValidateNested, IsBoolean, IsIn } from 'class-validator';
import { UserCredentialsContract, UserOrgCredentialsContract } from '../interfaces/credentials.contract';

export class AuthorizationEntity extends BaseEntity implements UserCredentialsContract {
  @IsMongoId()
  userId?: string;

  @IsArray()
  @IsIn([Roles.user, Roles.groupAdmin, Roles.staffAdmin, Roles.systemAdmin], { each: true })
  roles: string[] = [Roles.user];

  @ValidateNested()
  organizations?: OrganizationAuthorization[] = [];
}

export class OrganizationAuthorization implements UserOrgCredentialsContract {
  @IsBoolean()
  primary?: boolean;

  @IsMongoId()
  orgId?: string;

  @IsArray()
  @IsIn([OrganizationRoles.member, OrganizationRoles.admin], { each: true })
  organizationRoles: string[] = [];
}
