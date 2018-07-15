import request from 'supertest';
import { Test } from '@nestjs/testing';
import { CatsModule } from '../../src/cats/cats.module';
import { CatsService } from '../../src/cats/cats.service';
import { INestApplication } from '@nestjs/common';
import { AuthService } from '../../src/auth/auth.service';
import { AccessTokenWithMetadata } from '../../src/auth/interfaces/jwt-accessTokenData.interface';

describe('Cats', () => {
  let app: INestApplication;
  let authToken: AccessTokenWithMetadata;

  //
  // Setup mock data & services
  //
  const jwtPayload = { email: 'test@email.com', roles: ['staff'] };
  const catsService = { findAll: () => ['test'] };

  beforeAll(async () => {
    //
    // Instantiate nest application
    //
    const module = await Test.createTestingModule({
      imports: [CatsModule],
    })
      .overrideProvider(CatsService)
      .useValue(catsService)
      .compile();

    app = module.createNestApplication();
    await app.init();

    authToken = await app.get(AuthService).createToken(jwtPayload);
  });

  it(`/GET cats`, () => {
    return request(app.getHttpServer())
      .get('/cats')
      .expect(200)
      .expect({
        data: catsService.findAll(),
      });
  });

  it(`/GET protected cats`, () => {
    return request(app.getHttpServer())
      .get('/cats/protected')
      .expect(401);
  });

  it(`/GET cats with auth token`, () => {
    return request(app.getHttpServer())
      .get('/cats')
      .set('authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect({
        data: catsService.findAll(),
      });
  });

  it(`/GET protected cats with auth token`, () => {
    return request(app.getHttpServer())
      .get('/cats/protected')
      .set('authorization', `Bearer ${authToken.accessToken}`)
      .expect(200)
      .expect({
        data: catsService.findAll(),
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
