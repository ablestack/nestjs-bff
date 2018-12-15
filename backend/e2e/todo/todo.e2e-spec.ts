import { UserAuthApplicationService } from '@nestjs-bff/backend/lib/application/user-auth/user-auth.application.service';
import { JwtTokenHttpService } from '@nestjs-bff/backend/lib/host/http/core/jwt/jwt-token.http.service';
import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';
import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import 'jest';
import * as supertest from 'supertest';
import { AppConfig } from '../../src/config/app.config';
import { orgData } from '../shared/org-data';
import { userData } from '../shared/user-data';
import { TodoE2eModule } from './todo-e2e.module';

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

describe('Todo', () => {
  let app: INestApplication;
  const logger = getLogger();

  //
  // Setup mock data & services
  //
  beforeAll(async () => {
    logger.trace('---- Starting Todo e2e ----');

    //
    // Instantiate nest application
    //
    const module = await Test.createTestingModule({
      imports: [TodoE2eModule],
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

  // Organization Role Authorization
  it(`GIVEN a user protected endpoint
        AND no authorization
        WHEN a get request is made
        THEN access is denied`, async () => {
    const response = await supertest(app.getHttpServer()).get(
      `/todo/${orgData.domainA.slug}/${authData.domainA.regularUser.auth.userId}`,
    );

    expect(response.status).toEqual(403);
  });

  afterAll(async () => {
    logger.trace('---- Starting Todo e2e ----');
    if (app) await app.close();
  });
});
