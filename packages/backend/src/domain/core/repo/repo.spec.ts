import * as cacheManager from 'cache-manager';
import * as mongoose from 'mongoose';
import { NestjsBffConfig } from '../../../config/nestjs-bff.config';
import { LoggerConsoleSharedService } from '../../../shared/logging/console-logger.shared.service';
import { IFooModel } from './__mocks__/foo/model/foo.model';
import { FooSchema } from './__mocks__/foo/model/foo.schema';
import { FooRepo } from './__mocks__/foo/repo/foo.repo';
import { QueryValidatorService } from './validators/query-validator.service';

describe('BaseRepo', () => {
  let fooRepo: FooRepo;

  beforeAll(async () => {
    const loggerService = new LoggerConsoleSharedService(NestjsBffConfig);
    const queryValidatorService: QueryValidatorService = new QueryValidatorService(
      loggerService,
    );
    const fooModel = mongoose.model<IFooModel>('Foo', FooSchema);
    const memCache = cacheManager.caching({
      store: 'memory',
      max: 100,
      ttl: 10, /*seconds*/
    });
    fooRepo = new FooRepo(
      loggerService,
      queryValidatorService,
      fooModel,
      memCache,
      NestjsBffConfig,
    );
  });

  describe('findOne', () => {
    it('should return a Foo', async () => {
      const fooConditions = {
        slug: 'fooman',
      };

      // @ts-ignore
      jest.spyOn(fooRepo, '_mongooseFindOne').mockImplementation(conditions => {
        return fooConditions;
      });

      const result = await fooRepo.findOne({ _id: '507f191e810c19729de860ea' });
      expect(result).toBe(fooConditions);
    });
  });

  describe('validateQuery', () => {});

  describe('validateEntity', () => {});
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
