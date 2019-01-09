import * as cacheManager from 'cache-manager';
import * as mongoose from 'mongoose';
import { NestjsBffConfig } from '../../../config/nestjs-bff.config';
import { LoggerConsoleSharedService } from '../../../shared/logging/console-logger.shared.service';
import { getLogger } from '../../../shared/logging/logging.shared.module';
import { IFooModel } from '../../_foo/model/foo.model';
import { FooSchema } from '../../_foo/model/foo.schema';
import { FooRepo } from '../../_foo/repo/foo.repo';
import { TestAuthorizationLiterals, TestFooEntityLiterals } from '../_/test-literals.constants';

//
// Global Scoped Variables Setup
//

// @ts-ignore
const logger = getLogger();

describe('GIVEN a Repo', () => {
  let fooRepo: FooRepo;

  beforeAll(async () => {
    const loggerService = new LoggerConsoleSharedService(NestjsBffConfig);
    const fooModel = mongoose.model<IFooModel>('Foo', FooSchema);
    const memCache = cacheManager.caching({
      store: 'memory',
      max: 100,
      ttl: 10 /*seconds*/,
    });
    fooRepo = new FooRepo(loggerService, NestjsBffConfig, memCache, fooModel);
  });

  //
  // -------------------------------------------
  //

  // FindOne Tests

  //
  // -------------------------------------------
  //

  describe('WHEN findOne is called with an org-scoped and user-scoped Repo', () => {
    it(`WITH no authorization 
        THEN an error should be thrown`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindOne').mockImplementation(conditions => {
        return TestFooEntityLiterals.Fa_Ua2Oa;
      });

      try {
        result = await fooRepo.findOne({
          id: TestFooEntityLiterals.Fa_Ua2Oa.id,
        });
      } catch (e) {
        error = e;
      }

      expect(error).not.toBeUndefined();
      expect(result).not.toBe(TestFooEntityLiterals.Fa_Ua2Oa);
    });
  });

  //
  // -------------------------------------------
  //

  describe('WHEN findOne is called with an org-scoped and user-scoped Repo', () => {
    it(`WITH valid authorization 
        THEN a Foo should be returned`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindOne').mockImplementation(conditions => {
        return TestFooEntityLiterals.Fa_Ua2Oa;
      });

      try {
        result = await fooRepo.findOne({ id: TestFooEntityLiterals.Fa_Ua2Oa.id }, { authorization: TestAuthorizationLiterals.AzA_Ua1user_Oa1Admin });
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toBe(TestFooEntityLiterals.Fa_Ua2Oa);
    });
  });

  //
  // -------------------------------------------
  //

  // Find Tests

  //
  // -------------------------------------------
  //

  //
  // -------------------------------------------
  //

  // Patch Tests

  //
  // -------------------------------------------
  //

  //
  // -------------------------------------------
  //

  // Update Tests

  //
  // -------------------------------------------
  //

  //
  // -------------------------------------------
  //

  // Delete Tests

  //
  // -------------------------------------------
  //
});
//
// Unused Snippets
//

// Instantiate Object Via NestJS
/*
  const module = await Test.createTestingModule({
    imports: [DomainCoreModule, DomainFooModule],
  }).compile();

  fooRepo = await module.get<FooRepo>(FooRepo);
*/
