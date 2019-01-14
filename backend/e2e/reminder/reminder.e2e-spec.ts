import { UserAuthService } from '@nestjs-bff/backend/lib/application/user-auth/user-auth.service';
import { AccessPermissionsEntity } from '@nestjs-bff/backend/lib/domain/access-permissions/model/access-permissions.entity';
import { JwtTokenService } from '@nestjs-bff/backend/lib/host/http/core/jwt/jwt-token.service';
import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import 'jest';
import * as moment from 'moment';
import * as supertest from 'supertest';
import { ReminderRepo } from '../../src/app/domain/reminder/repo/reminder.repo';
import { AppConfig } from '../../src/config/app.config';
import { ReminderE2eModule } from './reminder-e2e.module';

// Config
// @ts-ignore
global.nestjs_bff = { AppConfig };

// Data
export const authData = {
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
};

export const reminderData = {
  RMa1_Uar: {
    userId: userData.Oa.UaOa,
    orgId: 'todo',
    title: 'Test Reminder',
    deadline: moment()
      .add(1, 'month')
      .toDate(),
    completed: false,
  },
};

describe('Reminder', () => {
  let app: INestApplication;
  // @ts-ignore
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

    const authService = await app.get(UserAuthService);
    const jwtTokenService = await app.get(JwtTokenService);
    const reminderRepo = await app.get(ReminderRepo);

    //
    // authenticate for required users
    //
    authData.domainA.adminUser.auth = await authService.signInWithLocal(userData.Oa.UaOb);
    authData.domainA.adminUser.jwt = await jwtTokenService.createToken(authData.domainA.adminUser.auth);

    authData.domainA.regularUser.auth = await authService.signInWithLocal(userData.Oa.UaOa);
    authData.domainA.regularUser.jwt = await jwtTokenService.createToken(authData.domainA.regularUser.auth);

    // add test reminder
    reminderRepo.create(reminderData.RMa1_Uar, { accessPermissions: accessPermissionsData.systemAdmin });
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
      `/Reminder/${orgData.Oa.slug}/${authData.domainA.regularUser.auth.userId}`,
    );

    expect(response.status).toEqual(403);
  });

  // Authorization Test - GREEN
  it(`GIVEN a Reminder endpoint
        AND an authorized user
        WHEN a get request is made
        THEN a successful response is returned`, async () => {
    const response = await supertest(app.getHttpServer())
      .get(`/Reminder/${orgData.Oa.slug}/${authData.domainA.regularUser.auth.userId}`)
      .set('authorization', `Bearer ${authData.domainA.regularUser.jwt.token}`);

    expect(response.status).toEqual(200);
  });

  afterAll(async () => {
    logger.trace('---- Starting Reminder e2e ----');
    if (app) await app.close();
  });
});
