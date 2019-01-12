import { LocalAuthenticateCommand } from '@nestjs-bff/global/lib/commands/auth/local-authenticate.command';
import { LocalRegisterCommand } from '@nestjs-bff/global/lib/commands/auth/local-register.command';
import { PromoteToGroupAdminCommand } from '@nestjs-bff/global/lib/commands/auth/promote-to-group-admin.command';
import { OrganizationRoles, Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { Injectable } from '@nestjs/common';
import { AuthenticationRepo } from '../../domain/authentication/repo/authentication.repo';
import { FacebookAuthenticationService } from '../../domain/authentication/social/facebook-authentication.service';
import { FacebookProfileService } from '../../domain/authentication/social/facebook-profile..service';
import { generateHashedPassword, validPassword } from '../../domain/authentication/utils/encryption.util';
import { UserPermissionsEntity } from '../../domain/authorization/model/user-permissions.entity';
import { UserPermissionsRepo } from '../../domain/authorization/repo/user-permissions.repo';
import { OrganizationRepo } from '../../domain/organization/repo/organization.repo';
import { UserRepo } from '../../domain/user/repo/user.repo';
import { AppError } from '../../shared/exceptions/app.exception';
import { ValidationError } from '../../shared/exceptions/validation.exception';

@Injectable()
export class UserAuthService {
  constructor(
    private readonly fbAuthenticationService: FacebookAuthenticationService,
    private readonly fbProfileService: FacebookProfileService,
    private readonly authenticationRepo: AuthenticationRepo,
    private readonly authorizationRepo: UserPermissionsRepo,
    private readonly userRepo: UserRepo,
    private readonly organizationRepo: OrganizationRepo,
  ) {}

  /**
   *
   * @param cmd
   */
  public async signInWithLocal(cmd: LocalAuthenticateCommand): Promise<UserPermissionsEntity> {
    const authenticationEntity = await this.authenticationRepo.findOne({ local: { email: cmd.username } });

    if (!authenticationEntity) throw new ValidationError(['Your login authorizationScope were not correct']);
    if (!authenticationEntity.local)
      throw new ValidationError(['Your login authorizationScope were not correct or you do not have an account. Perhaps you registered with social login?']);

    if (!validPassword(cmd.password, authenticationEntity.local.hashedPassword)) throw new ValidationError(['Your login authorizationScope were not correct']);

    const authorizationEntity = await this.authorizationRepo.findOne({ userId: authenticationEntity.userId });

    if (!authorizationEntity) throw new AppError('Could not find authorization information for signIn');

    return authorizationEntity;
  }

  /**
   *
   * @param cmd
   */
  public async signUpWithLocal(cmd: LocalRegisterCommand): Promise<UserPermissionsEntity> {
    //
    // setup commands
    //
    const newAuthenticationEntity = {
      userId: '',
      local: {
        email: cmd.username,
        hashedPassword: generateHashedPassword(cmd.password),
      },
      google: undefined,
      facebook: undefined,
      twitter: undefined,
    };

    //
    // validate
    //
    this.authenticationRepo.entityValidator.validate(newAuthenticationEntity);

    //
    // execute
    //

    // create new user
    const user = await this.userRepo.create({
      username: cmd.username,
      displayName: cmd.displayName,
    });

    // create authentication
    newAuthenticationEntity.userId = user.id;
    this.authenticationRepo.create(newAuthenticationEntity, { skipAuthorization: true });

    // create organization
    const organization = await this.organizationRepo.create({
      name: user.username,
      slug: user.username,
    });

    // create authorization
    const authorizationEntity = this.authorizationRepo.create(
      {
        userId: user.id,
        roles: [Roles.user],
        organizations: [
          {
            primary: true,
            orgId: organization.id,
            organizationRoles: [OrganizationRoles.member, OrganizationRoles.admin],
          },
        ],
      },
      { skipAuthorization: true },
    );

    return authorizationEntity;
  }

  /**
   *
   * @param cmd
   */
  public async promoteToGroupAdmin(cmd: PromoteToGroupAdminCommand): Promise<UserPermissionsEntity> {
    const authorizationEntity = await this.authorizationRepo.findOne({ userId: cmd.userId });

    // Validate
    if (!authorizationEntity) throw new AppError(`Could not find authorizationEntity for userId ${cmd.userId}`);
    if (authorizationEntity.roles.includes(Roles.groupAdmin)) throw new AppError(`User already GroupAdmin (userId ${cmd.userId})`);

    // Update
    authorizationEntity.roles.push(Roles.groupAdmin);

    // Persist
    return this.authorizationRepo.update(authorizationEntity).then(() => authorizationEntity);
  }

  /**
   *
   * @param fbAuthorizationCode
   * @param spaRootUrl
   */
  public async signUpWithFacebook(fbAuthorizationCode: string, spaRootUrl: string): Promise<UserPermissionsEntity> {
    // get fb auth token using fb access token
    const fbAuthorizationToken = await this.fbAuthenticationService.getOauthAccessToken(fbAuthorizationCode, spaRootUrl);

    // get fb profile
    const fbProfile = await this.fbProfileService.getProfile(fbAuthorizationToken);

    // find Authentication Entity
    const authenticationEntity = await this.authenticationRepo.findOne({ facebook: { id: fbProfile.id } });
    if (authenticationEntity) throw new AppError('Could not find authorization information for signIn');

    // create new user
    const user = await this.userRepo.create({
      username: fbProfile.email,
      displayName: fbProfile.name,
    });

    // create authentication
    this.authenticationRepo.create({
      userId: user.id,
      local: undefined,
      facebook: {
        id: fbProfile.id,
        email: fbProfile.email,
        name: fbProfile.name,
      },
      google: undefined,
      twitter: undefined,
    });

    // create authorization
    const authorizationEntity = this.authorizationRepo.create({
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
  public async signInWithFacebook(fbAuthorizationCode: string, spaRootUrl: string): Promise<UserPermissionsEntity> {
    // get fb auth token using fb access token
    const fbAuthorizationToken = await this.fbAuthenticationService.getOauthAccessToken(fbAuthorizationCode, spaRootUrl);

    // get fb profile
    const fbProfile = await this.fbProfileService.getProfile(fbAuthorizationToken);

    // find Authentication Entity
    const authenticationEntity = await this.authenticationRepo.findOne({ facebook: { id: fbProfile.id } });
    if (!authenticationEntity) throw new AppError('Could not find authentication information for signIn');

    const authorizationEntity = await this.authorizationRepo.findOne({ userId: authenticationEntity.userId });
    if (!authorizationEntity) throw new AppError('Could not find authorization information for signIn');

    return authorizationEntity;
  }
}
