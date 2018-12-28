import { LocalAuthenticateCommand } from '@nestjs-bff/global/lib/commands/auth/local-authenticate.command';
import { LocalRegisterCommand } from '@nestjs-bff/global/lib/commands/auth/local-register.command';
import { PromoteToGroupAdminCommand } from '@nestjs-bff/global/lib/commands/auth/promote-to-group-admin.command';
import { OrganizationRoles, Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';
import { Injectable } from '@nestjs/common';
import { AuthenticationDomainRepo } from '../../domain/authentication/repo/authentication.repo';
import { AuthenticationDomainRepoWrite } from '../../domain/authentication/repo/authentication.repo-write';
import { FacebookAuthenticationDomainService } from '../../domain/authentication/social/facebook-authentication.service';
import { FacebookProfileDomainService } from '../../domain/authentication/social/facebook-profile..service';
import { generateHashedPassword, validPassword } from '../../domain/authentication/utils/encryption.util';
import { AuthorizationRepoDomainCache } from '../../domain/authorization/repo/authorization.repo-cache';
import { AuthorizationDomainRepoWrite } from '../../domain/authorization/repo/authorization.repo-write';
import { OrganizationDomainRepoWrite } from '../../domain/organization/repo/organization.repo-write';
import { UserDomainRepoWrite } from '../../domain/user/repo/user.repo-write';
import { AppError } from '../../shared/exceptions/app.exception';
import { ValidationError } from '../../shared/exceptions/validation.exception';

@Injectable()
export class UserAuthApplicationService {
  constructor(
    private readonly fbAuthenticationService: FacebookAuthenticationDomainService,
    private readonly fbProfileService: FacebookProfileDomainService,
    private readonly authenticationRepo: AuthenticationDomainRepo,
    private readonly authenticationRepoWrite: AuthenticationDomainRepoWrite,
    private readonly authorizationRepoCache: AuthorizationRepoDomainCache,
    private readonly authorizationRepoWrite: AuthorizationDomainRepoWrite,
    private readonly userRepoWrite: UserDomainRepoWrite,
    private readonly organizationRepoWrite: OrganizationDomainRepoWrite,
  ) {}

  /**
   *
   * @param cmd
   */
  public async signInWithLocal(cmd: LocalAuthenticateCommand): Promise<AuthorizationEntity> {
    const authenticationEntity = await this.authenticationRepo.findByLocalEmail(cmd.username);

    if (!authenticationEntity) throw new ValidationError(['Your login credentials were not correct']);
    if (!authenticationEntity.local)
      throw new ValidationError([
        'Your login credentials were not correct or you do not have an account. Perhaps you registered with social login?',
      ]);

    if (!validPassword(cmd.password, authenticationEntity.local.hashedPassword))
      throw new ValidationError(['Your login credentials were not correct']);

    const authorizationEntity = await this.authorizationRepoCache.findOne({ userId: authenticationEntity.userId });

    if (!authorizationEntity) throw new AppError('Could not find authorization information for signIn');

    return authorizationEntity;
  }

  /**
   *
   * @param cmd
   */
  public async signUpWithLocal(cmd: LocalRegisterCommand): Promise<AuthorizationEntity> {
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
    this.authenticationRepoWrite.validate(newAuthenticationEntity);

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
          orgId: organization.id,
          organizationRoles: [OrganizationRoles.member, OrganizationRoles.admin],
        },
      ],
    });

    return authorizationEntity;
  }

  /**
   *
   * @param cmd
   */
  public async promoteToGroupAdmin(cmd: PromoteToGroupAdminCommand): Promise<AuthorizationEntity> {
    const authorizationEntity = await this.authorizationRepoCache.findOne({ userId: cmd.userId });

    // Validate
    if (!authorizationEntity) throw new AppError(`Could not find authorizationEntity for userId ${cmd.userId}`);
    if (authorizationEntity.roles.includes(Roles.groupAdmin)) throw new AppError(`User already GroupAdmin (userId ${cmd.userId})`);

    // Update
    authorizationEntity.roles.push(Roles.groupAdmin);

    // Persist
    return this.authorizationRepoWrite.update(authorizationEntity).then(() => authorizationEntity);
  }

  /**
   *
   * @param fbAuthorizationCode
   * @param spaRootUrl
   */
  public async signUpWithFacebook(fbAuthorizationCode: string, spaRootUrl: string): Promise<AuthorizationEntity> {
    // get fb auth token using fb access token
    const fbAuthorizationToken = await this.fbAuthenticationService.getOauthAccessToken(fbAuthorizationCode, spaRootUrl);

    // get fb profile
    const fbProfile = await this.fbProfileService.getProfile(fbAuthorizationToken);

    // find Authentication Entity
    const authenticationEntity = await this.authenticationRepo.findByFacebookId(fbProfile.id);
    if (authenticationEntity) throw new AppError('Could not find authorization information for signIn');

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
  public async signInWithFacebook(fbAuthorizationCode: string, spaRootUrl: string): Promise<AuthorizationEntity> {
    // get fb auth token using fb access token
    const fbAuthorizationToken = await this.fbAuthenticationService.getOauthAccessToken(fbAuthorizationCode, spaRootUrl);

    // get fb profile
    const fbProfile = await this.fbProfileService.getProfile(fbAuthorizationToken);

    // find Authentication Entity
    const authenticationEntity = await this.authenticationRepo.findByFacebookId(fbProfile.id);
    if (!authenticationEntity) throw new AppError('Could not find authentication information for signIn');

    const authorizationEntity = await this.authorizationRepoCache.findOne({ userId: authenticationEntity.userId });
    if (!authorizationEntity) throw new AppError('Could not find authorization information for signIn');

    return authorizationEntity;
  }
}
