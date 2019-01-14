import { OrganizationOrchestrationService } from '@nestjs-bff/backend/lib/application/organization-orchestration/organization-orchestration.service';
import { UserAuthService } from '@nestjs-bff/backend/lib/application/user-auth/user-auth.service';
import { AccessPermissionsEntity } from '@nestjs-bff/backend/lib/domain/access-permissions/model/access-permissions.entity';
import { AccessPermissionsRepo } from '@nestjs-bff/backend/lib/domain/access-permissions/repo/access-permissions.repo';
import {
  AuthenticationEntity,
  FacebookAuth,
  GoogleAuth,
  LocalAuth,
  TwitterAuth,
} from '@nestjs-bff/backend/lib/domain/authentication/model/authentication.entity';
import { AuthenticationRepo } from '@nestjs-bff/backend/lib/domain/authentication/repo/authentication.repo';
import { generateHashedPassword } from '@nestjs-bff/backend/lib/domain/authentication/utils/encryption.util';
import { OrganizationRepo } from '@nestjs-bff/backend/lib/domain/organization/repo/organization.repo';
import { UserRepo } from '@nestjs-bff/backend/lib/domain/user/repo/user.repo';
import { JwtTokenService } from '@nestjs-bff/backend/lib/host/http/core/jwt/jwt-token.service';
import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';
import { OrganizationRoles, Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { OrganizationEntity } from '@nestjs-bff/global/lib/entities/organization.entity';
import { UserEntity } from '@nestjs-bff/global/lib/entities/user.entity';
import { INestApplication } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import { AuthE2eModule } from '../auth/auth-e2e.module';
import { accessPermissionsData } from '../shared/access-permission-data';
import { orgData } from '../shared/org-data';
import { userData } from '../shared/user-data';

const authInitializer = new AuthenticationEntity();
authInitializer.local = new LocalAuth();
authInitializer.google = new GoogleAuth();
authInitializer.facebook = new FacebookAuth();
authInitializer.twitter = new TwitterAuth();

const authData = {
  domainA: {
    adminUser: {
      auth: new AccessPermissionsEntity(),
      jwt: { token: '' },
    },
    regularUser: {
      auth: new AccessPermissionsEntity(),
      jwt: { token: '' },
    },
  },
  domainB: {
    adminUser: {
      auth: new AccessPermissionsEntity(),
      jwt: { token: '' },
    },
  },
  domainGroupAdmin: {
    groupAdminUser: {
      auth: new AccessPermissionsEntity(),
      jwt: { token: '' },
    },
  },
};

const logger = getLogger();

export const setupAuth = async globalConfig => {
  //
  // Setup
  //
  const module = await Test.createTestingModule({
    imports: [AuthE2eModule],
  }).compile();

  const app: INestApplication = module.createNestApplication();
  await app.init();

  const authenticationRepo: AuthenticationRepo = await app.get(AuthenticationRepo);
  const organizationRepo: OrganizationRepo = await app.get(OrganizationRepo);
  const userRepo: UserRepo = await app.get(UserRepo);
  const accessPermissionsRepo: AccessPermissionsRepo = await app.get(AccessPermissionsRepo);

  const authService = await app.get(UserAuthService);
  const jwtTokenService = await app.get(JwtTokenService);
  const organizationAppService = await app.get(OrganizationOrchestrationService);

  //
  // Utility Functions
  //

  const newAuth = async (cmd: { user: UserEntity; org: OrganizationEntity; auth: { password: string } }) => {
    //
    // setup commands
    //
    const newAuthenticationEntity = {
      userId: cmd.user._id,
      local: {
        email: cmd.user.username,
        hashedPassword: generateHashedPassword(cmd.auth.password),
      },
      google: undefined,
      facebook: undefined,
      twitter: undefined,
    };

    //
    // execute
    //

    // create new user
    const user = await userRepo.create(
      {
        username: cmd.user.username,
        displayName: cmd.user.displayName,
      },
      { skipAuthorization: true },
    );

    // create authentication
    newAuthenticationEntity.userId = user._id;
    authenticationRepo.create(newAuthenticationEntity, { skipAuthorization: true });

    // create organization
    const organization = await organizationRepo.create(
      {
        name: user.username,
        slug: user.username,
      },
      { skipAuthorization: true },
    );

    // create authorization
    const authorizationEntity = accessPermissionsRepo.create(
      {
        userId: user._id,
        roles: [Roles.user],
        organizations: [
          {
            primary: true,
            orgId: organization._id,
            organizationRoles: [OrganizationRoles.member, OrganizationRoles.admin],
          },
        ],
      },
      { skipAuthorization: true },
    );

    return authorizationEntity;
  };

  //
  // Add Data
  //

  //
  // create domainA admin user
  //
  newAuth({ user: userData.Oa.UaOb, org: orgData.Oa, auth: { password: userData.Oa.UaOb.password } });

  authData.domainA.adminUser.auth = await authService.signUpWithLocal({
    username: userData.Oa.UaOb.username,
    displayName: userData.Oa.UaOb.displayName,
    password: userData.Oa.UaOb.password,
  });
  authData.domainA.adminUser.jwt = await jwtTokenService.createToken(authData.domainA.adminUser.auth);

  // logger.log(
  //   'authData.domainA.adminUser ------------------------------------------------------------------',
  //   JSON.stringify(authData.domainA.adminUser, null, 2),
  // );

  //
  // create domainA regular user
  //
  authData.domainA.regularUser.auth = await organizationAppService.createMember(
    {
      // @ts-ignore
      orgId: authData.domainA.adminUser.auth.organizations[0].orgId,
      username: userData.Oa.UaOa.username,
      displayName: userData.Oa.UaOa.displayName,
      password: userData.Oa.UaOa.password,
    },
    accessPermissionsData.systemAdmin,
  );
  authData.domainA.regularUser.jwt = await jwtTokenService.createToken(authData.domainA.regularUser.auth);

  // logger.debug(
  //   'authData.domainA.regularUser -----------------------------------------------------------------',
  //   JSON.stringify(authData.domainA.regularUser, null, 2),
  // );

  //
  // create domainB admin user
  //
  authData.domainB.adminUser.auth = await authService.signUpWithLocal({
    username: userData.Ob.adminUser.username,
    displayName: userData.Ob.adminUser.displayName,
    password: userData.Ob.adminUser.password,
  });
  authData.domainB.adminUser.jwt = await jwtTokenService.createToken(authData.domainB.adminUser.auth);

  // logger.debug(
  //   'authData.domainB.adminUser ---------------------------------------------------------------------',
  //   JSON.stringify(authData.domainB.adminUser, null, 2),
  // );

  //
  // create groupAdmin user (create then promote)
  //
  authData.domainGroupAdmin.groupAdminUser.auth = await authService.signUpWithLocal({
    username: userData.Oc.groupAdminUser.username,
    displayName: userData.Oc.groupAdminUser.displayName,
    password: userData.Oc.groupAdminUser.password,
  });

  // logger.debug(
  //   'authData.domainGroupAdmin.groupAdminUser (pre-promoted)------------------------------------------',
  //   JSON.stringify(authData.domainGroupAdmin.groupAdminUser, null, 2),
  // );

  authData.domainGroupAdmin.groupAdminUser.jwt = await jwtTokenService.createToken(
    await authService.promoteToGroupAdmin(
      {
        // tslint:disable-next-line:no-non-null-assertion
        userId: authData.domainGroupAdmin.groupAdminUser.auth.userId!,
      },
      accessPermissionsData.systemAdmin,
    ),
  );

  // logger.debug(
  //   'authData.domainGroupAdmin.groupAdminUser (promoted) ----------------------------------------------',
  //   JSON.stringify(authData.domainGroupAdmin.groupAdminUser, null, 2),
  // );

  logger.debug(
    `Users Created: ----------------------------------------------
    ${userData.Oa.UaOb.username}
    ${userData.Oa.UaOa.username}
    ${userData.Ob.adminUser.username}
    ${userData.Oc.groupAdminUser.username}`,
  );
};
