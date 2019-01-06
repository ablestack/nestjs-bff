import { Roles, OrganizationRoles } from '../constants/roles.constants';
import { BaseEntity } from './core/base.entity';
import { IsMongoId, IsArray, ValidateNested, IsBoolean, IsIn } from 'class-validator';
import { IUserCredentials, IUserOrgCredentials } from '../interfaces/credentials.interface';

export class AuthorizationEntity extends BaseEntity implements IUserCredentials {
  @IsMongoId()
  userId?: string;

  @IsArray()
  @IsIn([Roles.user, Roles.groupAdmin, Roles.staffAdmin, Roles.systemAdmin], { each: true })
  roles: string[] = [Roles.user];

  @ValidateNested()
  organizations?: OrganizationAuthorization[] = [];
}

export class OrganizationAuthorization implements IUserOrgCredentials {
  @IsBoolean()
  primary?: boolean;

  @IsMongoId()
  orgId?: string;

  @IsArray()
  @IsIn([OrganizationRoles.member, OrganizationRoles.admin], { each: true })
  organizationRoles: string[] = [];
}
