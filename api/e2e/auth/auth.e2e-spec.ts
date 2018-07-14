import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AuthModule } from '../../src/auth/auth.module';
import { AuthService } from '../../src/auth/auth.service';
import { INestApplication } from '@nestjs/common';
import { AuthenticateDto } from '../../src/auth/dto/authenticate-dto';

describe('Auth', () => {
  let app: INestApplication;

  const authService = {
    createToken: () => 'tokenString',
    authenticateUser: (authenticateDto: AuthenticateDto) => true,
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(AuthService)
      .useValue(authService)
      .compile();

    app = module.createNestApplication();
    await app.init();
  });

  it(`/POST auth`, () => {
    return request(app.getHttpServer())
      .post('/auth/authenticate')
      .set('authenticateDto', `{ username: 'staff@mydomain.com', password:'staff'}`)
      .expect(200)
      .expect({
        data: authService.createToken(),
      });
  });

  it(`/GET protected auth`, () => {
    return request(app.getHttpServer())
      .get('/auth/data')
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
