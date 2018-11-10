import { LocalAuthenticateCommand } from '@nestjs-bff/universal/commands/auth/local-authenticate.command';
import { LocalRegisterCommand } from '@nestjs-bff/universal/commands/auth/local-register.command';
import { PromoteToGroupAdminCommand } from '@nestjs-bff/universal/commands/auth/promote-to-group-admin.command';
import {
  OrganizationRoles,
  Roles,
} from '@nestjs-bff/universal/constants/roles.constants';
import { AuthorizationEntity } from '@nestjs-bff/universal/entities/authorization.entity';
import { Injectable } from '@nestjs/common';
import { AuthenticationDomainRepoRead } from '../../domain/authentication/repo/authentication.domain.repo-read';
import { AuthenticationDomainRepoWrite } from '../../domain/authentication/repo/authentication.domain.repo-write';
import { FacebookAuthenticationDomainService } from '../../domain/authentication/social/facebook-authentication.domain.service';
import { FacebookProfileDomainService } from '../../domain/authentication/social/facebook-profile.domain..service';
import {
  generateHashedPassword,
  validPassword,
} from '../../domain/authentication/utils/encryption.domain.util';
import { AuthenticationCreateValidator } from '../../domain/authentication/validators/authentication-create.validator';
import { AuthorizationRepoDomainCache } from '../../domain/authorization/repo/authorization.domain.repo-cache';
import { AuthorizationDomainRepoWrite } from '../../domain/authorization/repo/authorization.domain.repo-write';
import { OrganizationDomainRepoWrite } from '../../domain/organization/repo/organization.domain.repo-write';
import { UserDomainRepoWrite } from '../../domain/user/repo/user.domain.repo-write';
import { AppError } from '../../shared/exceptions/app.exception';

@Injectable()
export class UserAuthApplicationService {
  constructor(
    private readonly fbAuthenticationService: FacebookAuthenticationDomainService,
    private readonly fbProfileService: FacebookProfileDomainService,
    private readonly authenticationRepoRead: AuthenticationDomainRepoRead,
    private readonly authenticationRepoWrite: AuthenticationDomainRepoWrite,
    private readonly authorizationRepoCache: AuthorizationRepoDomainCache,
    private readonly authorizationRepoWrite: AuthorizationDomainRepoWrite,
    private readonly userRepoWrite: UserDomainRepoWrite,
    private readonly organizationRepoWrite: OrganizationDomainRepoWrite,
    private readonly authenticationCreateValidator: AuthenticationCreateValidator,
  ) {}

  /**
   *
   * @param cmd
   */
  public async signInWithLocal(
    cmd: LocalAuthenticateCommand,
  ): Promise<AuthorizationEntity> {
    const authenticationEntity = await this.authenticationRepoRead.findByLocalEmail(
      cmd.username,
    );

    if (!authenticationEntity)
      throw new AppError('Your login credentials were not correct');
    if (!authenticationEntity.local)
      throw new AppError('Your login credentials were not correct');

    if (!validPassword(cmd.password, authenticationEntity.local.hashedPassword))
      throw new AppError('Your login credentials were not correct');

    const authorizationEntity = await this.authorizationRepoCache.findByUserId(
      authenticationEntity.userId,
    );

    if (!authorizationEntity)
      throw new AppError('Could not find authorization information for signIn');

    return authorizationEntity;
  }

  /**
   *
   * @param cmd
   */
  public async signUpWithLocal(
    cmd: LocalRegisterCommand,
  ): Promise<AuthorizationEntity> {
    //
    // setup commands
    //
    const newAuthenticationEntity = {
      userId: '',
      local: {
        email: cmd.username,
        hashedPassword: generateHashedPassword(cmd.password),
      },
    };

    //
    // validate
    //
    await this.authenticationCreateValidator.validate(newAuthenticationEntity, {
      skipUserIdValidation: true,
    });

    //
    // execute
    //

    // create new user
    const user = await this.userRepoWrite.create({
      username: cmd.username,
      displayName: cmd.displayName,
    });

    // create authentication
    newAuthenticationEntity.userId = user.id;
    this.authenticationRepoWrite.create(newAuthenticationEntity);

    // create organization
    const organization = await this.organizationRepoWrite.create({
      name: user.username,
      slug: user.username,
    });

    // create authorization
    const authorizationEntity = this.authorizationRepoWrite.create({
      userId: user.id,
      roles: [Roles.user],
      organizations: [
        {
          primary: true,
          organizationId: organization.id,
          organizationRoles: [
            OrganizationRoles.member,
            OrganizationRoles.admin,
          ],
        },
      ],
    });

    return authorizationEntity;
  }

  /**
   *
   * @param cmd
   */
  public async promoteToGroupAdmin(
    cmd: PromoteToGroupAdminCommand,
  ): Promise<AuthorizationEntity> {
    const authorizationEntity = await this.authorizationRepoCache.findByUserId(
      cmd.userId,
    );

    // Validate
    if (!authorizationEntity)
      throw new AppError(
        `Could not find authorizationEntity for userId ${cmd.userId}`,
      );
    if (authorizationEntity.roles.includes(Roles.groupAdmin))
      throw new AppError(`User already GroupAdmin (userId ${cmd.userId})`);

    // Update
    authorizationEntity.roles.push(Roles.groupAdmin);

    // Persist
    return this.authorizationRepoWrite.update(authorizationEntity);
  }

  /**
   *
   * @param fbAuthorizationCode
   * @param spaRootUrl
   */
  public async signUpWithFacebook(
    fbAuthorizationCode: string,
    spaRootUrl: string,
  ): Promise<AuthorizationEntity> {
    // get fb auth token using fb access token
    const fbAuthorizationToken = await this.fbAuthenticationService.getOauthAccessToken(
      fbAuthorizationCode,
      spaRootUrl,
    );

    // get fb profile
    const fbProfile = await this.fbProfileService.getProfile(
      fbAuthorizationToken,
    );

    // find Authentication Entity
    const authenticationEntity = await this.authenticationRepoRead.findByFacebookId(
      fbProfile.id,
    );
    if (authenticationEntity)
      throw new AppError('Could not find authorization information for signIn');

    // create new user
    const user = await this.userRepoWrite.create({
      username: fbProfile.email,
      displayName: fbProfile.name,
    });

    // create authentication
    this.authenticationRepoWrite.create({
      userId: user.id,
      facebook: {
        id: fbProfile.id,
        email: fbProfile.email,
        name: fbProfile.name,
      },
    });

    // create authorization
    const authorizationEntity = this.authorizationRepoWrite.create({
      userId: user.id,
      roles: [Roles.user],
      organizations: [],
    });

    return authorizationEntity;
  }

  /**
   *
   * @param fbAuthorizationCode
   * @param spaRootUrl
   */
  public async signInWithFacebook(
    fbAuthorizationCode: string,
    spaRootUrl: string,
  ): Promise<AuthorizationEntity> {
    // get fb auth token using fb access token
    const fbAuthorizationToken = await this.fbAuthenticationService.getOauthAccessToken(
      fbAuthorizationCode,
      spaRootUrl,
    );

    // get fb profile
    const fbProfile = await this.fbProfileService.getProfile(
      fbAuthorizationToken,
    );

    // find Authentication Entity
    const authenticationEntity = await this.authenticationRepoRead.findByFacebookId(
      fbProfile.id,
    );
    if (!authenticationEntity)
      throw new AppError(
        'Could not find authentication information for signIn',
      );

    const authorizationEntity = await this.authorizationRepoCache.findByUserId(
      authenticationEntity.userId,
    );
    if (!authorizationEntity)
      throw new AppError('Could not find authorization information for signIn');

    return authorizationEntity;
  }
}
