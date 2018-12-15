import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import 'jest';
import * as supertest from 'supertest';
import { AppConfig } from '../../src/config/app.config';
import { authData } from '../_core/global-setup-auth';
import { TodoE2eModule } from './todo-e2e.module';

// Config
// @ts-ignore
global.nestjs_bff = { AppConfig };

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

    logger.log('Todo - authData', authData);
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
      `/todo/${authData.domainA.slug}/${authData.domainA.regularUser.auth.userId}`,
    );

    expect(response.status).toEqual(403);
  });

  afterAll(async () => {
    logger.trace('---- Starting Todo e2e ----');
    if (app) await app.close();
  });
});
