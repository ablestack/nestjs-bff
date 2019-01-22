import { Test, TestingModule } from '@nestjs/testing';
import { WebAppHealthCheckController } from './web-app-health-check.controller';
import { WebAppHealthCheckService } from './web-app-health-check.service';

describe('WebAppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [WebAppHealthCheckController],
      providers: [WebAppHealthCheckService],
    }).compile();
  });

  describe('root', () => {
    it('should return "UP"', () => {
      const appController = app.get<WebAppHealthCheckController>(WebAppHealthCheckController);
      expect(appController.root()).toBe('UP');
    });
  });
});
