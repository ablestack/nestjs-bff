import 'jest';
import supertest from 'supertest';
import { Test } from '@nestjs/testing';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthService } from '../../src/auth/auth.service';
import { INestApplication } from '@nestjs/common';
import { AuthenticateDto } from '../../src/auth/dto/authenticate-dto';
import { users } from '../../src/auth/users.const';

describe('Auth', () => {
  let app: INestApplication;

  //
  // Setup mock data & services
  //
  const regularUser = users.find(user => user.username === 'user@mydomain.com');
  let regularUserJWTToken: any;
  const staffUser = users.find(user => user.username === 'staff@mydomain.com');
  let staffUserJWTToken: any;

  beforeAll(async () => {
    //
    // Instantiate nest application
    //
    const module = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    supertest(app.getHttpServer())
      .post('/api/auth/authenticate')
      .send({ authenticateDto: { username: regularUser.username, password: regularUser.password } })
      .end(function(err, res) {
        regularUserJWTToken = JSON.parse(res.text).data;
      });

    supertest(app.getHttpServer())
      .post('/api/auth/authenticate')
      .send({ authenticateDto: { username: staffUser.username, password: staffUser.password } })
      .end(function(err, res) {
        staffUserJWTToken = JSON.parse(res.text).data;
      });
  });

  it(`/POST auth`, () => {
    return supertest(app.getHttpServer())
      .post('/api/auth/authenticate')
      .send({ authenticateDto: { username: regularUser.username, password: regularUser.password } })
      .expect(201);
  });

  it(`/GET protected data without auth token`, () => {
    return supertest(app.getHttpServer())
      .get('/api/auth/data')
      .expect(401);
  });

  it(`/GET protected data with wrong role`, () => {
    return supertest(app.getHttpServer())
      .get('/api/auth/data')
      .set('authorization', `Bearer ${regularUserJWTToken.accessToken}`)
      .expect(403);
  });

  it(`/GET protected data with correct role`, () => {
    return supertest(app.getHttpServer())
      .get('/api/auth/data')
      .set('authorization', `Bearer ${staffUserJWTToken.accessToken}`)
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});
