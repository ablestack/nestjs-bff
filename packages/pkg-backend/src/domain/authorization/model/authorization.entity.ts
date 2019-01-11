import { OrganizationRoles, Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { BaseEntity } from '@nestjs-bff/global/lib/entities/core/base.entity';
import { AuthorizationScopeContract, UserOrgCredentialsContract } from '@nestjs-bff/global/lib/interfaces/authorization-scope.contract';
import { IsArray, IsBoolean, IsIn, IsMongoId, ValidateNested } from 'class-validator';

export class AuthorizationEntity extends BaseEntity implements AuthorizationScopeContract {
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
