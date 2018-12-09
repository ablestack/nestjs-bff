import { CreateOrganizationMemberCommand } from '@nestjs-bff/global/lib/lib/commands/auth/create-organization-member.command';
import { OrganizationRoles, Roles } from '@nestjs-bff/global/lib/lib/constants/roles.constants';
import { AuthorizationEntity } from '@nestjs-bff/global/lib/lib/entities/authorization.entity';
import { Injectable } from '@nestjs/common';
import { AuthenticationDomainRepoWrite } from '../../domain/authentication/repo/authentication.domain.repo-write';
import { generateHashedPassword } from '../../domain/authentication/utils/encryption.domain.util';
import { AuthenticationCreateValidator } from '../../domain/authentication/validators/authentication-create.validator';
import { AuthorizationDomainRepoWrite } from '../../domain/authorization/repo/authorization.domain.repo-write';
import { OrganizationDomainRepoCache } from '../../domain/organization/repo/organization.domain.repo-cache';
import { UserDomainRepoWrite } from '../../domain/user/repo/user.domain.repo-write';
import { AppError } from '../../shared/exceptions/app.exception';

@Injectable()
export class OrganizationApplicationService {
  constructor(
    private readonly authenticationRepoWrite: AuthenticationDomainRepoWrite,
    private readonly authorizationRepoWrite: AuthorizationDomainRepoWrite,
    private readonly userRepoWrite: UserDomainRepoWrite,
    private readonly organizationRepoCache: OrganizationDomainRepoCache,
    private readonly authenticationCreateValidator: AuthenticationCreateValidator,
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
    await this.authenticationCreateValidator.validate(newAuthenticationEntity, {
      skipUserIdValidation: true,
    });

    // validate organization exists
    if (!(await this.organizationRepoCache.findById(cmd.organizationId))) {
      throw new AppError(`Could not find organization for Id ${cmd.organizationId}`);
    }

    // create new user
    const user = await this.userRepoWrite.create({
      username: cmd.username,
      displayName: cmd.displayName,
    });

    // create authentication
    newAuthenticationEntity.userId = user.id;
    this.authenticationRepoWrite.create(newAuthenticationEntity);

    // create authorization
    const authorizationEntity = this.authorizationRepoWrite.create({
      userId: user.id,
      roles: [Roles.user],
      organizations: [
        {
          primary: true,
          organizationId: cmd.organizationId,
          organizationRoles: [OrganizationRoles.member],
        },
      ],
    });

    return authorizationEntity;
  }
}
