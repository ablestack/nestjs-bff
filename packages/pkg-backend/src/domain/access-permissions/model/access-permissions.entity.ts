import { OrganizationRoles, Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { BaseEntity } from '@nestjs-bff/global/lib/entities/core/base.entity';
import { AccessPermissionsContract, UserOrgPermissionsContract } from '../../../../../pkg-global/lib/interfaces/access-permissions.contract';
import { IsArray, IsBoolean, IsIn, IsMongoId, ValidateNested } from 'class-validator';

export class AccessPermissionsEntity extends BaseEntity implements AccessPermissionsContract {
  @IsMongoId()
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

  @IsMongoId()
  orgId?: string;

  @IsArray()
  @IsIn([OrganizationRoles.member, OrganizationRoles.admin], { each: true })
  organizationRoles: string[] = [];
}
