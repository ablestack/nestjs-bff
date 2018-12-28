import { UserAuthService } from '@nestjs-bff/backend/lib/application/user-auth/user-auth.service';
import { JwtTokenService } from '@nestjs-bff/backend/lib/host/http/core/jwt/jwt-token.service';
import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import 'jest';
import * as supertest from 'supertest';
import { AppConfig } from '../../src/config/app.config';
import { orgData } from '../shared/org-data';
import { userData } from '../shared/user-data';
import { AuthE2eModule } from './auth-e2e.module';

// Config
// @ts-ignore
global.nestjs_bff = { AppConfig };

// Data
export const authData = {
  domainA: {
    adminUser: {
      jwt: { token: '' },
    },
    regularUser: {
      jwt: { token: '' },
    },
  },
  domainB: {
    adminUser: {
      jwt: { token: '' },
    },
  },
  domainGroupAdmin: {
    groupAdminUser: {
      jwt: { token: '' },
    },
  },
};

describe('Auth', () => {
  let app: INestApplication;
  const logger = getLogger();

  //
  // Setup mock data & services
  //
  beforeAll(async () => {
    logger.trace('---- Starting Auth e2e ----');

    const module = await Test.createTestingModule({
      imports: [AuthE2eModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const authService = await app.get(UserAuthService);
    const jwtTokenService = await app.get(JwtTokenService);

    //
    // authenticate for required users
    //

    authData.domainA.adminUser.jwt = await jwtTokenService.createToken(
      await authService.signInWithLocal(userData.domainA.adminUser),
    );

    authData.domainA.regularUser.jwt = await jwtTokenService.createToken(
      await authService.signInWithLocal(userData.domainA.regularUser),
    );

    authData.domainB.adminUser.jwt = await jwtTokenService.createToken(
      await authService.signInWithLocal(userData.domainB.adminUser),
    );

    authData.domainGroupAdmin.groupAdminUser.jwt = await jwtTokenService.createToken(
      await authService.signInWithLocal(userData.domainGroupAdmin.groupAdminUser),
    );
  }, 5 * 60 * 1000);

  //
  // Run tests
  //
  it(`GIVEN an unauthenticated user
  WHEN incorrect signin data is posted to the signin endpoint
  THEN the user is not authenticated, and an appropriate error message is returned`, async () => {
    const response = await supertest(app.getHttpServer())
      .post('/auth/public/local/signin')
      .send({
        username: userData.domainA.regularUser.username,
        password: 'bad-password',
      });

    expect(response.status).toEqual(400);
    expect(response.type).toBe('application/json');
    expect(response.body).not.toHaveProperty('token');
    expect(response.error).toBeDefined();
  });

  it(`GIVEN an unauthenticated user
        WHEN correct signin data is posted to the signin endpoint
        THEN the user is successfully authenticated and receives a JWT token`, async () => {
    const response = await supertest(app.getHttpServer())
      .post('/auth/public/local/signin')
      .send({
        username: userData.domainA.regularUser.username,
        password: userData.domainA.regularUser.password,
      });

    expect(response.status).toEqual(201);
    expect(response.type).toBe('application/json');
    expect(response.body).toHaveProperty('token');
    expect(response.body.token).toBeDefined();
    expect(token => token && token.length > 150);
  });

  //
  // Authentication
  //

  it(`GIVEN an unauthenticated user with no auth token 
        WHEN a GET request is made for public data 
        THEN the request succeeds`, async () => {
    const response = await supertest(app.getHttpServer()).get('/auth/public/verification');

    expect(response.status).toEqual(200);
  });

  //
  // Authorization Decorator
  //

  it(`GIVEN an endpoint without an authorization decorator
        WHEN a request is made
        THEN access is denied`, async () => {
    const response = await supertest(app.getHttpServer()).get('/auth/verification/no-authorization-decorator');

    expect(response.status).toEqual(403);
  });

  //
  // Role Authorization
  //

  it(`GIVEN a role protected endpoint
        WHEN an unauthenticated request is made
        THEN access is denied`, async () => {
    const response = await supertest(app.getHttpServer()).get('/auth/verification/role-protected-group-admin');

    expect(response.status).toEqual(403);
  });

  it(`GIVEN a groupAdmin role protected endpoint 
        AND authorization that does not include groupAdmin role 
        WHEN get request is made
        THEN access is denied`, async () => {
    const response = await supertest(app.getHttpServer())
      .get('/auth/verification/role-protected-group-admin')
      .set('authorization', `Bearer ${authData.domainA.regularUser.jwt.token}`);

    expect(response.status).toEqual(403);
  });

  it(`GIVEN a groupAdmin role protected endpoint 
        AND authorization that includes groupAdmin role 
        WHEN get request is made
        THEN access is denied`, async () => {
    const response = await supertest(app.getHttpServer())
      .get('/auth/verification/role-protected-group-admin')
      .set('authorization', `Bearer ${authData.domainGroupAdmin.groupAdminUser.jwt.token}`);

    expect(response.status).toEqual(200);
  });

  //
  // Organization Role Authorization
  //

  it(`GIVEN a organization member role protected endpoint 
        AND authorization that does not include any authorization for that organization
        WHEN a get request is made 
        THEN access is denied`, async () => {
    const response = await supertest(app.getHttpServer())
      .get(`/auth/${orgData.domainA.slug}/verification/organization-protected-member`)
      .set('authorization', `Bearer ${authData.domainB.adminUser.jwt.token}`);

    expect(response.status).toEqual(403);
  });

  it(`GIVEN a organization member role protected endpoint 
        AND authorization that includes member role authorization for that organization
        WHEN a get request is made 
        THEN the request is successful`, async () => {
    const response = await supertest(app.getHttpServer())
      .get(`/auth/${orgData.domainA.slug}/verification/organization-protected-member`)
      .set('authorization', `Bearer ${authData.domainA.regularUser.jwt.token}`);

    expect(response.status).toEqual(200);
  });

  it(`GIVEN a organization admin role protected endpoint 
        AND authorization that does not include any authorization for that organization
        WHEN a get request is made 
        THEN access is denied`, async () => {
    const response = await supertest(app.getHttpServer())
      .get(`/auth/${orgData.domainA.slug}/verification/organization-protected-admin`)
      .set('authorization', `Bearer ${authData.domainA.regularUser.jwt.token}`);

    expect(response.status).toEqual(403);
  });

  it(`GIVEN a organization admin role protected endpoint 
        AND authorization that includes member role authorization for that organization
        WHEN a get request is made 
        THEN access is denied`, async () => {
    const response = await supertest(app.getHttpServer())
      .get(`/auth/${orgData.domainA.slug}/verification/organization-protected-admin`)
      .set('authorization', `Bearer ${authData.domainA.regularUser.jwt.token}`);

    expect(response.status).toEqual(403);
  });

  it(`GIVEN a organization admin role protected endpoint 
        AND authorization that includes admin role authorization for that organization
        WHEN a get request is made 
        THEN request is successful`, async () => {
    const response = await supertest(app.getHttpServer())
      .get(`/auth/${orgData.domainA.slug}/verification/organization-protected-admin`)
      .set('authorization', `Bearer ${authData.domainA.adminUser.jwt.token}`);

    expect(response.status).toEqual(200);
  });

  afterAll(async () => {
    logger.trace('---- Ending Auth e2e ----');
    if (app) await app.close();
  });
});
