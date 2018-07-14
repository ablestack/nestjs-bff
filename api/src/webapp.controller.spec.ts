import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WebAppController } from './webapp.controller';
import { WebAppService } from './webapp.service';

describe('WebAppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [WebAppController],
      providers: [WebAppService],
    }).compile();
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      const appController = app.get<WebAppController>(WebAppController);
      expect(appController.root()).toBe('Hello World!');
    });
  });
});
