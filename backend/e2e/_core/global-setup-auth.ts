import { OrganizationOrchestrationService } from '@nestjs-bff/backend/lib/application/organization-orchestration/organization-orchestration.service';
import { UserAuthService } from '@nestjs-bff/backend/lib/application/user-auth/user-auth.service';
import { AccessPermissionsEntity } from '@nestjs-bff/backend/lib/domain/access-permissions/model/access-permissions.entity';
import {
  AuthenticationEntity,
  FacebookAuth,
  GoogleAuth,
  LocalAuth,
  TwitterAuth,
} from '@nestjs-bff/backend/lib/domain/authentication/model/authentication.entity';
import { JwtTokenService } from '@nestjs-bff/backend/lib/host/http/core/jwt/jwt-token.service';
import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';
import { INestApplication } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import { AuthE2eModule } from '../auth/auth-e2e.module';
import { accessPermissionsData } from '../shared/access-permission-data';
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
  const module = await Test.createTestingModule({
    imports: [AuthE2eModule],
  }).compile();

  const app: INestApplication = module.createNestApplication();
  await app.init();

  const authService = await app.get(UserAuthService);
  const jwtTokenService = await app.get(JwtTokenService);
  const organizationAppService = await app.get(OrganizationOrchestrationService);

  //
  // create domainA admin user
  //

  authData.domainA.adminUser.auth = await authService.signUpWithLocal({
    username: userData.domainA.adminUser.username,
    displayName: userData.domainA.adminUser.displayName,
    password: userData.domainA.adminUser.password,
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
      username: userData.domainA.regularUser.username,
      displayName: userData.domainA.regularUser.displayName,
      password: userData.domainA.regularUser.password,
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
    username: userData.domainB.adminUser.username,
    displayName: userData.domainB.adminUser.displayName,
    password: userData.domainB.adminUser.password,
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
    username: userData.domainGroupAdmin.groupAdminUser.username,
    displayName: userData.domainGroupAdmin.groupAdminUser.displayName,
    password: userData.domainGroupAdmin.groupAdminUser.password,
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
    ${userData.domainA.adminUser.username}
    ${userData.domainA.regularUser.username}
    ${userData.domainB.adminUser.username}
    ${userData.domainGroupAdmin.groupAdminUser.username}`,
  );
};
