import { OrganizationApplicationService } from '@nestjs-bff/backend/application/organization/organization.application.service';
import { UserAuthApplicationService } from '@nestjs-bff/backend/application/user-auth/user-auth.application.service';
import { JwtTokenHttpService } from '@nestjs-bff/backend/host/http/core/jwt/jwt-token.http.service';
import { getLogger } from '@nestjs-bff/backend/shared/logging/logging.shared.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import 'jest';
import * as supertest from 'supertest';
import { AppConfig } from '../../src/config/app.config';
import { AuthE2eModule } from './auth-e2e.module';

// Config
// @ts-ignore
global.nestjs_bff = { AppConfig };

describe('Auth', () => {
  const logger = getLogger();
  let app: INestApplication;

  //
  // Setup mock data & services
  //
  const data = {
    domainA: {
      slug: 'admin@domain-a.com',
      adminUser: {
        registration: {
          username: 'admin@domain-a.com',
          displayName: 'first-name last-name',
          password: 'supersecretpassword',
        },
        jwt: { token: '' },
      },
      regularUser: {
        registration: {
          username: 'user@domain-a.com',
          displayName: 'first-name last-name',
          password: 'supersecretpassword',
        },
        jwt: { token: '' },
      },
    },
    domainB: {
      slug: 'admin@domain-b.com',
      adminUser: {
        registration: {
          username: 'admin@domain-b.com',
          displayName: 'regular user',
          password: 'supersecretpassword',
        },
        jwt: { token: '' },
      },
    },
    domainGroupAdmin: {
      slug: 'group-admin@group-admin-domain.com',
      groupAdminUser: {
        registration: {
          username: 'group-admin@group-admin-domain.com',
          displayName: 'first-name last-name',
          password: 'supersecretpassword',
        },
        jwt: { token: '' },
      },
    },
  };

  beforeAll(async () => {
    //
    // Instantiate nest application
    //
    const module = await Test.createTestingModule({
      imports: [AuthE2eModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    const authService = await app.get(UserAuthApplicationService);
    const jwtTokenService = await app.get(JwtTokenHttpService);
    const organizationAppService = await app.get(OrganizationApplicationService);

    //
    // create domainA admin user
    //

    const domainA_adminUser_authorization = await authService.signUpWithLocal({
      username: data.domainA.adminUser.registration.username,
      displayName: data.domainA.adminUser.registration.displayName,
      password: data.domainA.adminUser.registration.password,
    });
    data.domainA.adminUser.jwt = await jwtTokenService.createToken(domainA_adminUser_authorization);

    logger.debug('data.adminUser.jwt', data.domainA.adminUser.jwt ? data.domainA.adminUser.jwt : 'null');

    //
    // create domainA regular user
    //
    data.domainA.regularUser.jwt = await jwtTokenService.createToken(
      await organizationAppService.createMember({
        organizationId: domainA_adminUser_authorization.organizations[0].organizationId,
        username: data.domainA.regularUser.registration.username,
        displayName: data.domainA.regularUser.registration.displayName,
        password: data.domainA.regularUser.registration.password,
      }),
    );

    logger.debug('data.domainA.regularUser.jwt', data.domainA.regularUser.jwt ? data.domainA.regularUser.jwt : 'null');
    console.log('data.domainA.regularUser ------------------------------------------------------------------');
    console.log(data.domainA.regularUser);

    //
    // create domainB admin user
    //
    data.domainB.adminUser.jwt = await jwtTokenService.createToken(
      await authService.signUpWithLocal({
        username: data.domainB.adminUser.registration.username,
        displayName: data.domainB.adminUser.registration.displayName,
        password: data.domainB.adminUser.registration.password,
      }),
    );

    logger.debug('data.domainB.adminUser.jwt', data.domainB.adminUser.jwt ? data.domainB.adminUser.jwt : 'null');

    //
    // create groupAdmin user (create then promote)
    //
    const groupAdminUser = await authService.signUpWithLocal({
      username: data.domainGroupAdmin.groupAdminUser.registration.username,
      displayName: data.domainGroupAdmin.groupAdminUser.registration.displayName,
      password: data.domainGroupAdmin.groupAdminUser.registration.password,
    });

    data.domainGroupAdmin.groupAdminUser.jwt = await jwtTokenService.createToken(
      await authService.promoteToGroupAdmin({
        // tslint:disable-next-line:no-non-null-assertion
        userId: groupAdminUser.userId!,
      }),
    );

    logger.debug(
      'data.groupAdminUser.jwt',
      data.domainGroupAdmin.groupAdminUser.jwt ? data.domainGroupAdmin.groupAdminUser.jwt : 'null',
    );
  }, 5 * 60 * 1000);

  it(`GIVEN an unauthenticated user
        WHEN correct signin data is posted to the signin endpoint
        THEN the user is successfully authenticated and receives a JWT token`, async () => {
    const response = await supertest(app.getHttpServer())
      .post('/api/auth/public/local/signin')
      .send({
        username: data.domainA.regularUser.registration.username,
        password: data.domainA.regularUser.registration.password,
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
    const response = await supertest(app.getHttpServer()).get('/api/auth/public/verification');

    expect(response.status).toEqual(200);
  });

  //
  // Authorization Decorator
  //

  it(`GIVEN an endpoint without an authorization decorator
        WHEN a request is made
        THEN access is denied`, async () => {
    const response = await supertest(app.getHttpServer()).get('/api/auth/verification/no-authorization-decorator');

    expect(response.status).toEqual(403);
  });

  //
  // Role Authorization
  //

  it(`GIVEN a role protected endpoint
        WHEN an unauthenticated request is made
        THEN access is denied`, async () => {
    const response = await supertest(app.getHttpServer()).get('/api/auth/verification/role-protected-group-admin');

    expect(response.status).toEqual(403);
  });

  it(`GIVEN a groupAdmin role protected endpoint 
        AND authorization that does not include groupAdmin role 
        WHEN get request is made
        THEN access is denied`, async () => {
    const response = await supertest(app.getHttpServer())
      .get('/api/auth/verification/role-protected-group-admin')
      .set('authorization', `Bearer ${data.domainA.regularUser.jwt.token}`);

    expect(response.status).toEqual(403);
  });

  it(`GIVEN a groupAdmin role protected endpoint 
        AND authorization that includes groupAdmin role 
        WHEN get request is made
        THEN access is denied`, async () => {
    const response = await supertest(app.getHttpServer())
      .get('/api/auth/verification/role-protected-group-admin')
      .set('authorization', `Bearer ${data.domainGroupAdmin.groupAdminUser.jwt.token}`);

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
      .get(`/api/auth/${data.domainA.slug}/verification/organization-protected-member`)
      .set('authorization', `Bearer ${data.domainB.adminUser.jwt.token}`);

    expect(response.status).toEqual(403);
  });

  it(`GIVEN a organization member role protected endpoint 
        AND authorization that includes member role authorization for that organization
        WHEN a get request is made 
        THEN the request is successful`, async () => {
    const response = await supertest(app.getHttpServer())
      .get(`/api/auth/${data.domainA.slug}/verification/organization-protected-member`)
      .set('authorization', `Bearer ${data.domainA.regularUser.jwt.token}`);

    expect(response.status).toEqual(200);
  });

  it(`GIVEN a organization admin role protected endpoint 
        AND authorization that does not include any authorization for that organization
        WHEN a get request is made 
        THEN access is denied`, async () => {
    const response = await supertest(app.getHttpServer())
      .get(`/api/auth/${data.domainA.slug}/verification/organization-protected-admin`)
      .set('authorization', `Bearer ${data.domainA.regularUser.jwt.token}`);

    expect(response.status).toEqual(403);
  });

  it(`GIVEN a organization admin role protected endpoint 
        AND authorization that includes member role authorization for that organization
        WHEN a get request is made 
        THEN access is denied`, async () => {
    const response = await supertest(app.getHttpServer())
      .get(`/api/auth/${data.domainA.slug}/verification/organization-protected-admin`)
      .set('authorization', `Bearer ${data.domainA.regularUser.jwt.token}`);

    expect(response.status).toEqual(403);
  });

  it(`GIVEN a organization admin role protected endpoint 
        AND authorization that includes admin role authorization for that organization
        WHEN a get request is made 
        THEN request is successful`, async () => {
    const response = await supertest(app.getHttpServer())
      .get(`/api/auth/${data.domainA.slug}/verification/organization-protected-admin`)
      .set('authorization', `Bearer ${data.domainA.adminUser.jwt.token}`);

    expect(response.status).toEqual(200);
  });

  afterAll(async () => {
    if (app) await app.close();
  });
});
