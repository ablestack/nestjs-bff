import { LocalAuthenticateCommand } from '@nestjs-bff/global/lib/application/auth/local-authenticate.command';
import { LocalRegisterCommand } from '@nestjs-bff/global/lib/application/auth/local-register.command';
import { PromoteToGroupAdminCommand } from '@nestjs-bff/global/lib/application/auth/promote-to-group-admin.command';
import { OrganizationRoles, Roles } from '@nestjs-bff/global/lib/shared/authorization/roles.constants';
import { AccessPermissionsContract } from '@nestjs-bff/global/lib/domain/access-permissions/access-permissions.contract';
import { Injectable } from '@nestjs/common';
import { AccessPermissionsEntity } from '../../domain/access-permissions/model/access-permissions.entity';
import { AccessPermissionsRepo } from '../../domain/access-permissions/repo/access-permissions.repo';
import { AuthenticationRepo } from '../../domain/authentication/repo/authentication.repo';
import { FacebookAuthenticationService } from '../../domain/authentication/social/facebook-authentication.service';
import { FacebookProfileService } from '../../domain/authentication/social/facebook-profile..service';
import { generateHashedPassword, validPassword } from '../../domain/authentication/utils/encryption.util';
import { OrganizationRepo } from '../../domain/organization/repo/organization.repo';
import { UserRepo } from '../../domain/user/repo/user.repo';
import { AppError } from '../../shared/exceptions/app.exception';
import { ValidationError } from '../../shared/exceptions/validation.exception';

@Injectable()
export class UserAuthService {
  constructor(
    // private readonly logger: LoggerSharedService,
    private readonly fbAuthenticationService: FacebookAuthenticationService,
    private readonly fbProfileService: FacebookProfileService,
    private readonly authenticationRepo: AuthenticationRepo,
    private readonly accessPermissionsRepo: AccessPermissionsRepo,
    private readonly userRepo: UserRepo,
    private readonly organizationRepo: OrganizationRepo,
  ) {}

  /**
   *
   * @param cmd
   */
  public async signInWithLocal(cmd: LocalAuthenticateCommand): Promise<AccessPermissionsEntity> {
    const authenticationEntity = await this.authenticationRepo.findOne({ 'local.email': cmd.username }, { skipAuthorization: true });

    if (!authenticationEntity) throw new ValidationError(['Your login credentials were not correct']);
    if (!authenticationEntity.local)
      throw new ValidationError(['Your login credentials were not correct or you do not have an account. Perhaps you registered with social login?']);
    if (!authenticationEntity.userId) throw new AppError('UserId can not be null');

    if (!validPassword(cmd.password, authenticationEntity.local.hashedPassword)) throw new ValidationError(['Your login credentials were not correct']);

    const accessPermissionsEntity = await this.accessPermissionsRepo.findOne({ userId: authenticationEntity.userId }, { skipAuthorization: true });

    if (!accessPermissionsEntity) throw new AppError('Could not find access permission information for signIn');

    return accessPermissionsEntity;
  }

  /**
   *
   * @param cmd
   */
  public async signUpWithLocal(cmd: LocalRegisterCommand): Promise<AccessPermissionsEntity> {
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
    const user = await this.userRepo.create(
      {
        username: cmd.username,
        displayName: cmd.displayName,
      },
      { skipAuthorization: true },
    );

    // create authentication
    newAuthenticationEntity.userId = user.id;
    this.authenticationRepo.create(newAuthenticationEntity, {
      skipAuthorization: true,
    });

    // create organization
    const organization = await this.organizationRepo.create(
      {
        name: user.username,
        slug: user.username,
      },
      { skipAuthorization: true },
    );

    // create authorization
    const accessPermissionsEntity = this.accessPermissionsRepo.create(
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

    return accessPermissionsEntity;
  }

  /**
   *
   * @param cmd
   */
  public async promoteToGroupAdmin(cmd: PromoteToGroupAdminCommand, accessPermissions: AccessPermissionsContract): Promise<AccessPermissionsEntity> {
    const accessPermissionsEntity = await this.accessPermissionsRepo.findById(cmd.userId, { accessPermissions });

    // Validate
    if (!accessPermissionsEntity) throw new AppError(`Could not find accessPermissionsEntity for userId ${cmd.userId}`);
    if (accessPermissionsEntity.roles.includes(Roles.groupAdmin)) throw new AppError(`User already GroupAdmin (userId ${cmd.userId})`);

    // Update
    accessPermissionsEntity.roles.push(Roles.groupAdmin);

    // Persist
    return this.accessPermissionsRepo.update(accessPermissionsEntity, { accessPermissions }).then(() => accessPermissionsEntity);
  }

  /**
   *
   * @param fbAuthorizationCode
   * @param spaRootUrl
   */
  public async signUpWithFacebook(fbAuthorizationCode: string, spaRootUrl: string): Promise<AccessPermissionsEntity> {
    // get fb auth token using fb access token
    const fbAuthorizationToken = await this.fbAuthenticationService.getOauthAccessToken(fbAuthorizationCode, spaRootUrl);

    // get fb profile
    const fbProfile = await this.fbProfileService.getProfile(fbAuthorizationToken);

    // find Authentication Entity
    const authenticationEntity = await this.authenticationRepo.findOne({ facebook: { id: fbProfile.id } }, { skipAuthorization: true });
    if (authenticationEntity) throw new AppError('Could not find authorization information for signIn');

    // create new user
    const user = await this.userRepo.create(
      {
        username: fbProfile.email,
        displayName: fbProfile.name,
      },
      { skipAuthorization: true },
    );

    // create authentication
    this.authenticationRepo.create(
      {
        userId: user.id,
        local: undefined,
        facebook: {
          id: fbProfile.id,
          email: fbProfile.email,
          name: fbProfile.name,
        },
        google: undefined,
        twitter: undefined,
      },
      { skipAuthorization: true },
    );

    // create authorization
    const accessPermissionsEntity = this.accessPermissionsRepo.create(
      {
        userId: user.id,
        roles: [Roles.user],
        organizations: [],
      },
      { skipAuthorization: true },
    );

    return accessPermissionsEntity;
  }

  /**
   *
   * @param fbAuthorizationCode
   * @param spaRootUrl
   */
  public async signInWithFacebook(fbAuthorizationCode: string, spaRootUrl: string): Promise<AccessPermissionsEntity> {
    // get fb auth token using fb access token
    const fbAuthorizationToken = await this.fbAuthenticationService.getOauthAccessToken(fbAuthorizationCode, spaRootUrl);

    // get fb profile
    const fbProfile = await this.fbProfileService.getProfile(fbAuthorizationToken);

    // find Authentication Entity
    const authenticationEntity = await this.authenticationRepo.findOne({ facebook: { id: fbProfile.id } }, { skipAuthorization: true });
    if (!authenticationEntity) throw new AppError('Could not find authentication information for signIn');

    const accessPermissionsEntity = await this.accessPermissionsRepo.findOne({ userId: authenticationEntity.userId }, { skipAuthorization: true });
    if (!accessPermissionsEntity) throw new AppError('Could not find authorization information for signIn');

    return accessPermissionsEntity;
  }
}
