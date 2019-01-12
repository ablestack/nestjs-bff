import { CreateOrganizationMemberCommand } from '@nestjs-bff/global/lib/commands/auth/create-organization-member.command';
import { OrganizationRoles, Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AccessPermissionsContract } from '@nestjs-bff/global/lib/interfaces/access-permissions.contract';
import { Injectable } from '@nestjs/common';
import { AccessPermissionsEntity } from '../../domain/access-permissions/model/access-permissions.entity';
import { AccessPermissionsRepo } from '../../domain/access-permissions/repo/access-permissions.repo';
import { AuthenticationRepo } from '../../domain/authentication/repo/authentication.repo';
import { generateHashedPassword } from '../../domain/authentication/utils/encryption.util';
import { OrganizationRepo } from '../../domain/organization/repo/organization.repo';
import { UserRepo } from '../../domain/user/repo/user.repo';
import { CrudOperations } from '../../shared/authchecks/crud-operations.enum';
import { OrgRolesAuthCheck } from '../../shared/authchecks/org-roles.authcheck';
import { AppError } from '../../shared/exceptions/app.exception';
import { LoggerSharedService } from '../../shared/logging/logger.shared.service';

@Injectable()
export class OrganizationOrchestrationService {
  // private orgUserAuthCheck = new OrgRolesAuthCheck([OrganizationRoles.member]);
  private orgAdminAuthCheck = new OrgRolesAuthCheck([OrganizationRoles.admin]);

  constructor(
    private readonly logger: LoggerSharedService,
    private readonly authenticationRepo: AuthenticationRepo,
    private readonly accessPermissionsRepo: AccessPermissionsRepo,
    private readonly userRepo: UserRepo,
    private readonly organizationRepo: OrganizationRepo,
  ) {}

  public async createMember(cmd: CreateOrganizationMemberCommand, accessPermissions?: AccessPermissionsContract): Promise<AccessPermissionsEntity> {
    this.logger.trace('OrganizationOrchestrationService.createMember', { cmd, accessPermissions });

    // Authorization
    this.orgAdminAuthCheck.ensureAuthorized({
      accessPermissions,
      origin: 'OrganizationOrchestrationService',
      targetResource: { orgId: cmd.orgId },
      operation: CrudOperations.create,
    });

    // setup commands
    const newAuthenticationEntity = {
      userId: undefined,
      local: {
        email: cmd.username,
        hashedPassword: generateHashedPassword(cmd.password),
      },
      google: undefined,
      facebook: undefined,
      twitter: undefined,
    };

    // validate
    this.authenticationRepo.entityValidator.validate(newAuthenticationEntity);

    // validate organization exists
    if (!(await this.organizationRepo.tryfindOne({ _id: cmd.orgId }, { accessPermissions }))) {
      throw new AppError(`Create Member: Could not find organization for Id ${cmd.orgId}`);
    }

    // create new user
    const user = await this.userRepo.create(
      {
        username: cmd.username,
        displayName: cmd.displayName,
      },
      { accessPermissions },
    );

    // create authentication
    newAuthenticationEntity.userId = user._id;
    this.authenticationRepo.create(newAuthenticationEntity, { accessPermissions });

    // create authorization
    const accessPermissionsEntity = this.accessPermissionsRepo.create(
      {
        userId: user._id,
        roles: [Roles.user],
        organizations: [
          {
            primary: true,
            orgId: cmd.orgId,
            organizationRoles: [OrganizationRoles.member],
          },
        ],
      },
      { accessPermissions },
    );

    return accessPermissionsEntity;
  }
}
