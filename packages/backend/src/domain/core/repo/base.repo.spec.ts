import * as cacheManager from 'cache-manager';
import * as mongoose from 'mongoose';
import { NestjsBffConfig } from '../../../config/nestjs-bff.config';
import { LoggerConsoleSharedService } from '../../../shared/logging/console-logger.shared.service';
import { getLogger } from '../../../shared/logging/logging.shared.module';
import { TestingUtils } from '../../../shared/utils/testing.utils';
import { IFooModel } from '../__mocks__/foo/model/foo.model';
import { FooSchema } from '../__mocks__/foo/model/foo.schema';
import { FooRepo } from '../__mocks__/foo/repo/foo.repo';

// @ts-ignore
const logger = getLogger();

describe('BaseRepo', () => {
  let fooRepo: FooRepo;

  beforeAll(async () => {
    const loggerService = new LoggerConsoleSharedService(NestjsBffConfig);
    const fooModel = mongoose.model<IFooModel>('Foo', FooSchema);
    const memCache = cacheManager.caching({
      store: 'memory',
      max: 100,
      ttl: 10 /*seconds*/,
    });
    fooRepo = new FooRepo(loggerService, fooModel, memCache, NestjsBffConfig);
  });

  describe('findOne', () => {
    it('should return a Foo', async () => {
      const fooConditions = {
        id: TestingUtils.generateMongoObjectIdString(),
        slug: 'fooman',
        orgId: TestingUtils.generateMongoObjectIdString(),
        userId: TestingUtils.generateMongoObjectIdString(),
      };

      // @ts-ignore
      jest.spyOn(fooRepo, '_mongooseFindOne').mockImplementation(conditions => {
        return fooConditions;
      });

      const result = await fooRepo.findOne({
        id: '507f191e810c19729de860ea',
        orgId: fooConditions.orgId,
        userId: fooConditions.userId,
      });
      expect(result).toBe(fooConditions);
    });
  });

  describe('findMany', () => {});

  describe('validateEntity', () => {
    describe('should pass validation when passed a valid entity', async () => {
      const fooConditions = {
        slug: 'fooman',
        orgId: TestingUtils.generateMongoObjectIdString(),
        userId: TestingUtils.generateMongoObjectIdString(),
      };

      let error: any;
      try {
        await fooRepo.entityValidator.validate(fooConditions);
      } catch (e) {
        error = e;
        // logger.debug('error', { error, innerErrors: error.metaData.errors });
      }

      expect(error).toBeUndefined();
    });

    describe('should throw an error when passed an invalid entity', async () => {
      const fooConditions = {
        slug: 'fooman',
        orgId: TestingUtils.generateMongoObjectIdString(),
        userId: TestingUtils.generateMongoObjectIdString(),
      };

      let error: any;
      try {
        await fooRepo.entityValidator.validate(fooConditions);
      } catch (e) {
        error = e;
        // logger.debug('error', { error, innerErrors: error.metaData.errors });
      }

      expect(error).not.toBeUndefined();
    });
  });
});

//
// Unused Snippits
//

// Instantiate Object Via NestJS
/*
  const module = await Test.createTestingModule({
    imports: [DomainCoreModule, DomainFooModule],
  }).compile();

  fooRepo = await module.get<FooRepo>(FooRepo);
*/
