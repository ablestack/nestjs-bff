import { setupTestDataJwtTokens, testData } from '@nestjs-bff/backend/lib-e2e/core/test-object-literals.constants';
import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';
import { HttpServer, INestApplication } from '@nestjs/common';
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

export const reminderData = {
  RMa1_Uar: {
    userId: testData.orgA.users.regularUser.userEntity.id,
    orgId: testData.orgA.orgEntity.id,
    title: 'Test Reminder',
    deadline: moment()
      .add(1, 'month')
      .toDate(),
    completed: false,
  },
};

describe('Reminder', () => {
  let app: INestApplication;
  let httpServer: HttpServer;
  // @ts-ignore
  const logger = getLogger();

  //
  // Setup mock data & services
  //
  beforeAll(async () => {
    logger.trace('---- Starting Reminder e2e ----');

    await setupTestDataJwtTokens();

    //
    // Instantiate nest application
    //
    const module = await Test.createTestingModule({
      imports: [ReminderE2eModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();
    httpServer = app.getHttpServer();

    const reminderRepo = await app.get(ReminderRepo);

    // add test reminder
    reminderRepo.create(reminderData.RMa1_Uar, {
      accessPermissions: testData.orgZ.users.systemAdminUser.accessPermissionsEntity,
    });
  }, 5 * 60 * 1000);

  //
  // Run tests
  //

  // Authorization Test - RED
  it(`GIVEN a Reminder endpoint
        AND no authorization
        WHEN a get request is made
        THEN access is denied`, async () => {
    const response = await supertest(httpServer).get(
      `/Reminder/${testData.orgA.orgEntity.slug}/${testData.orgA.users.regularUser.userEntity.id}`,
    );

    expect(response.status).toEqual(403);
  });

  // Authorization Test - GREEN
  it(`GIVEN a Reminder endpoint
        AND an authorized user
        WHEN a get request is made
        THEN a successful response is returned`, async () => {
    const response = await supertest(httpServer)
      .get(`/Reminder/${testData.orgA.orgEntity.slug}/${testData.orgA.users.regularUser.userEntity.id}`)
      .set('authorization', `Bearer ${testData.orgA.users.regularUser.jwt.token}`);

    expect(response.status).toEqual(200);
  });

  afterAll(async done => {
    logger.trace('---- Starting Reminder e2e ----');
    if (httpServer) httpServer.close();
    if (app) await app.close();
  });
});
