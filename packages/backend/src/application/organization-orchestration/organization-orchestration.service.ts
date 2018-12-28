import { CreateOrganizationMemberCommand } from '@nestjs-bff/global/lib/commands/auth/create-organization-member.command';
import { OrganizationRoles, Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';
import { Injectable } from '@nestjs/common';
import { AuthenticationRepo } from '../../domain/authentication/repo/authentication.repo';
import { generateHashedPassword } from '../../domain/authentication/utils/encryption.util';
import { AuthorizationRepo } from '../../domain/authorization/repo/authorization.repo';
import { OrganizationRepo } from '../../domain/organization/repo/organization.repo';
import { UserRepo } from '../../domain/user/repo/user.repo';
import { AppError } from '../../shared/exceptions/app.exception';

@Injectable()
export class OrganizationOrchestrationService {
  constructor(
    private readonly authenticationRepo: AuthenticationRepo,
    private readonly authorizationRepo: AuthorizationRepo,
    private readonly userRepo: UserRepo,
    private readonly organizationRepo: OrganizationRepo,
  ) {}

  public async createMember(cmd: CreateOrganizationMemberCommand): Promise<AuthorizationEntity> {
    // setup commands
    const newAuthenticationEntity = {
      userId: '',
      local: {
        email: cmd.username,
        hashedPassword: generateHashedPassword(cmd.password),
      },
    };

    // validate
    this.authenticationRepo.validateEntity(newAuthenticationEntity);

    // validate organization exists
    if (!(await this.organizationRepo.findOne({ _id: cmd.orgId }))) {
      throw new AppError(`Could not find organization for Id ${cmd.orgId}`);
    }

    // create new user
    const user = await this.userRepo.create({
      username: cmd.username,
      displayName: cmd.displayName,
    });

    // create authentication
    newAuthenticationEntity.userId = user.id;
    this.authenticationRepo.create(newAuthenticationEntity);

    // create authorization
    const authorizationEntity = this.authorizationRepo.create({
      userId: user.id,
      roles: [Roles.user],
      organizations: [
        {
          primary: true,
          orgId: cmd.orgId,
          organizationRoles: [OrganizationRoles.member],
        },
      ],
    });

    return authorizationEntity;
  }
}
