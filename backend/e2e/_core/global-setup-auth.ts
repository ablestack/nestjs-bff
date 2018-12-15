import { OrganizationApplicationService } from '@nestjs-bff/backend/lib/application/organization/organization.application.service';
import { UserAuthApplicationService } from '@nestjs-bff/backend/lib/application/user-auth/user-auth.application.service';
import { JwtTokenHttpService } from '@nestjs-bff/backend/lib/host/http/core/jwt/jwt-token.http.service';
import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';
import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';
import { INestApplication } from '@nestjs/common/interfaces';
import { Test } from '@nestjs/testing';
import { AuthE2eModule } from '../auth/auth-e2e.module';

export const authData = {
  domainA: {
    slug: 'admin@domain.com',
    adminUser: {
      registration: {
        username: 'admin@domain.com',
        displayName: 'first-name last-name',
        password: 'pa55word',
      },
      auth: new AuthorizationEntity(),
      jwt: { token: '' },
    },
    regularUser: {
      registration: {
        username: 'user@domain.com',
        displayName: 'first-name last-name',
        password: 'pa55word',
      },
      auth: new AuthorizationEntity(),
      jwt: { token: '' },
    },
  },
  domainB: {
    slug: 'admin@domain-b.com',
    adminUser: {
      registration: {
        username: 'admin@domain-b.com',
        displayName: 'regular user',
        password: 'pa55word',
      },
      auth: new AuthorizationEntity(),
      jwt: { token: '' },
    },
  },
  domainGroupAdmin: {
    slug: 'group-admin@group-admin-domain.com',
    groupAdminUser: {
      registration: {
        username: 'group-admin@group-admin-domain.com',
        displayName: 'first-name last-name',
        password: 'pa55word',
      },
      auth: new AuthorizationEntity(),
      jwt: { token: '' },
    },
  },
};

const logger = getLogger();

export const setupAuth = async () => {
  const module = await Test.createTestingModule({
    imports: [AuthE2eModule],
  }).compile();

  const app: INestApplication = module.createNestApplication();
  await app.init();

  const authService = await app.get(UserAuthApplicationService);
  const jwtTokenService = await app.get(JwtTokenHttpService);
  const organizationAppService = await app.get(OrganizationApplicationService);

  //
  // create domainA admin user
  //

  authData.domainA.adminUser.auth = await authService.signUpWithLocal({
    username: authData.domainA.adminUser.registration.username,
    displayName: authData.domainA.adminUser.registration.displayName,
    password: authData.domainA.adminUser.registration.password,
  });
  authData.domainA.adminUser.jwt = await jwtTokenService.createToken(authData.domainA.adminUser.auth);

  logger.log(
    'authData.domainA.adminUser ------------------------------------------------------------------',
    authData.domainA.adminUser,
  );

  //
  // create domainA regular user
  //
  authData.domainA.regularUser.auth = await organizationAppService.createMember({
    organizationId: authData.domainA.adminUser.auth.organizations[0].organizationId,
    username: authData.domainA.regularUser.registration.username,
    displayName: authData.domainA.regularUser.registration.displayName,
    password: authData.domainA.regularUser.registration.password,
  });
  authData.domainA.regularUser.jwt = await jwtTokenService.createToken(authData.domainA.regularUser.auth);

  logger.debug(
    'authData.domainA.regularUser -----------------------------------------------------------------',
    authData.domainA.regularUser,
  );

  //
  // create domainB admin user
  //
  authData.domainB.adminUser.auth = await authService.signUpWithLocal({
    username: authData.domainB.adminUser.registration.username,
    displayName: authData.domainB.adminUser.registration.displayName,
    password: authData.domainB.adminUser.registration.password,
  });
  authData.domainB.adminUser.jwt = await jwtTokenService.createToken(authData.domainB.adminUser.auth);

  logger.debug(
    'authData.domainB.adminUser ---------------------------------------------------------------------',
    authData.domainB.adminUser,
  );

  //
  // create groupAdmin user (create then promote)
  //
  authData.domainGroupAdmin.groupAdminUser.auth = await authService.signUpWithLocal({
    username: authData.domainGroupAdmin.groupAdminUser.registration.username,
    displayName: authData.domainGroupAdmin.groupAdminUser.registration.displayName,
    password: authData.domainGroupAdmin.groupAdminUser.registration.password,
  });

  logger.debug(
    'authData.domainGroupAdmin.groupAdminUser (pre-promoted)------------------------------------------',
    authData.domainGroupAdmin.groupAdminUser,
  );

  authData.domainGroupAdmin.groupAdminUser.jwt = await jwtTokenService.createToken(
    await authService.promoteToGroupAdmin({
      // tslint:disable-next-line:no-non-null-assertion
      userId: authData.domainGroupAdmin.groupAdminUser.auth.userId!,
    }),
  );

  logger.debug(
    'authData.domainGroupAdmin.groupAdminUser (promoted) ----------------------------------------------',
    authData.domainGroupAdmin.groupAdminUser,
  );
};
