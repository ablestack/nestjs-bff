import { UserAuthApplicationService } from '@nestjs-bff/backend/lib/application/user-auth/user-auth.service';
import { JwtTokenHttpService } from '@nestjs-bff/backend/lib/host/http/core/jwt/jwt-token.service';
import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';
import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import 'jest';
import * as supertest from 'supertest';
import { AppConfig } from '../../src/config/app.config';
import { orgData } from '../shared/org-data';
import { userData } from '../shared/user-data';
import { ReminderE2eModule } from './reminder-e2e.module';

// Config
// @ts-ignore
global.nestjs_bff = { AppConfig };

// Data
export const authData = {
  domainA: {
    adminUser: {
      auth: new AuthorizationEntity(),
      jwt: { token: '' },
    },
    regularUser: {
      auth: new AuthorizationEntity(),
      jwt: { token: '' },
    },
  },
};

describe('Reminder', () => {
  let app: INestApplication;
  const logger = getLogger();

  //
  // Setup mock data & services
  //
  beforeAll(async () => {
    logger.trace('---- Starting Reminder e2e ----');

    //
    // Instantiate nest application
    //
    const module = await Test.createTestingModule({
      imports: [ReminderE2eModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const authService = await app.get(UserAuthApplicationService);
    const jwtTokenService = await app.get(JwtTokenHttpService);

    //
    // authenticate for required users
    //
    authData.domainA.adminUser.auth = await authService.signInWithLocal(userData.domainA.adminUser);
    authData.domainA.adminUser.jwt = await jwtTokenService.createToken(authData.domainA.adminUser.auth);

    authData.domainA.regularUser.auth = await authService.signInWithLocal(userData.domainA.regularUser);
    authData.domainA.regularUser.jwt = await jwtTokenService.createToken(authData.domainA.regularUser.auth);
  }, 5 * 60 * 1000);

  //
  // Run tests
  //

  // Authorization Test - RED
  it(`GIVEN a Reminder endpoint
        AND no authorization
        WHEN a get request is made
        THEN access is denied`, async () => {
    const response = await supertest(app.getHttpServer()).get(
      `/Reminder/${orgData.domainA.slug}/${authData.domainA.regularUser.auth.userId}`,
    );

    expect(response.status).toEqual(403);
  });

  // Authorization Test - GREEN
  it(`GIVEN a Reminder endpoint
        AND an authorized user
        WHEN a get request is made
        THEN a successful response is returned`, async () => {
    const response = await supertest(app.getHttpServer())
      .get(`/Reminder/${orgData.domainA.slug}/${authData.domainA.regularUser.auth.userId}`)
      .set('authorization', `Bearer ${authData.domainA.regularUser.jwt.token}`);

    expect(response.status).toEqual(200);
  });

  afterAll(async () => {
    logger.trace('---- Starting Reminder e2e ----');
    if (app) await app.close();
  });
});
