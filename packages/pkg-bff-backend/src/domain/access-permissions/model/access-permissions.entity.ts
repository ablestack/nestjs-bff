import { OrganizationRoles, Roles } from '@nestjs-bff/global-contracts/lib/shared/authorization/roles.constants';
import { BaseEntity } from '@nestjs-bff/global-contracts/lib/domain/core/base.entity';
import { AccessPermissionsContract, UserOrgPermissionsContract } from '@nestjs-bff/global-contracts/lib/domain/access-permissions/access-permissions.contract';
import { IsArray, IsBoolean, IsIn, IsNotEmpty, ValidateNested } from 'class-validator';

export class AccessPermissionsEntity extends BaseEntity implements AccessPermissionsContract {
  @IsNotEmpty()
  userId?: string;

  @IsArray()
  @IsIn([Roles.user, Roles.groupAdmin, Roles.staffAdmin, Roles.systemAdmin], { each: true })
  roles: string[] = [Roles.user];

  @ValidateNested()
  organizations?: OrganizationAuthorization[] = [];
}

export class OrganizationAuthorization implements UserOrgPermissionsContract {
  @IsBoolean()
  primary?: boolean;

  @IsNotEmpty()
  orgId?: string;

  @IsArray()
  @IsIn([OrganizationRoles.member, OrganizationRoles.admin], { each: true })
  organizationRoles: string[] = [];
}
