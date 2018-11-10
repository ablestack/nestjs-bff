import { Test, TestingModule } from '@nestjs/testing';
import { WebAppHealthCheckService } from './web-app-health-check.http.service';
import { WebAppController } from './web-app.http.controller';

describe('WebAppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [WebAppController],
      providers: [WebAppHealthCheckService],
    }).compile();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get<WebAppController>(WebAppController);
      expect(appController.root()).toBe('UP');
    });
  });
});
