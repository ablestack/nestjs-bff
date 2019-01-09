import * as cacheManager from 'cache-manager';
import * as mongoose from 'mongoose';
import { NestjsBffConfig } from '../../../config/nestjs-bff.config';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { LoggerConsoleSharedService } from '../../../shared/logging/console-logger.shared.service';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
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
  let memCache: CacheStore;
  let loggerService: LoggerSharedService;
  let fooModel: mongoose.Model<IFooModel>;

  beforeAll(async () => {
    loggerService = new LoggerConsoleSharedService(NestjsBffConfig);
    fooModel = mongoose.model<IFooModel>('Foo', FooSchema);
  });

  //
  // -------------------------------------------
  //

  beforeEach(async () => {
    memCache = cacheManager.caching({
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
    it(`WITH valid authorization 
        THEN a Foo should be returned`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindOne').mockImplementation(conditions => {
        return TestFooEntityLiterals.Fa_Ua2Oa;
      });

      try {
        result = await fooRepo.findOne({ id: TestFooEntityLiterals.Fa_Ua2Oa.id }, { authorization: TestAuthorizationLiterals.Az_Ua2User_OaMember });
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toBe(TestFooEntityLiterals.Fa_Ua2Oa);
    });

    //
    // -------------------------------------------
    //

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

    //
    // -------------------------------------------
    //

    it(`WITH no authorization
        WITH options.skipAuthorization = true 
        THEN an Foo should be returned`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindOne').mockImplementation(conditions => {
        return TestFooEntityLiterals.Fa_Ua2Oa;
      });

      try {
        result = await fooRepo.findOne(
          {
            id: TestFooEntityLiterals.Fa_Ua2Oa.id,
          },
          { skipAuthorization: true },
        );
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toBe(TestFooEntityLiterals.Fa_Ua2Oa);
    });
  });

  //
  // -------------------------------------------
  // -------------------------------------------
  //

  describe('WHEN findOne is called twice with an org-scoped and user-scoped Repo', () => {
    it(`WITH valid authorization 
        THEN _dbFindOne should only be triggered once (the other is from cache) `, async () => {
      let error;

      // @ts-ignore
      const spyDbFindOne = jest.spyOn(fooRepo, '_dbFindOne').mockImplementation(conditions => {
        return TestFooEntityLiterals.Fa_Ua2Oa;
      });

      try {
        await fooRepo.findOne({ id: TestFooEntityLiterals.Fa_Ua2Oa.id }, { authorization: TestAuthorizationLiterals.Az_Ua2User_OaMember });
        await fooRepo.findOne({ id: TestFooEntityLiterals.Fa_Ua2Oa.id }, { authorization: TestAuthorizationLiterals.Az_Ua2User_OaMember });
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(spyDbFindOne).toBeCalledTimes(1);
    });

    //
    // -------------------------------------------
    //

    it(`WITH valid authorization
        AND options.skipCache = true 
        THEN _dbFindOne should be triggered twice (cache not used) `, async () => {
      let error;

      // @ts-ignore
      const spyDbFindOne = jest.spyOn(fooRepo, '_dbFindOne').mockImplementation(conditions => {
        return TestFooEntityLiterals.Fa_Ua2Oa;
      });

      try {
        await fooRepo.findOne({ id: TestFooEntityLiterals.Fa_Ua2Oa.id }, { authorization: TestAuthorizationLiterals.Az_Ua2User_OaMember, skipCache: true });
        await fooRepo.findOne({ id: TestFooEntityLiterals.Fa_Ua2Oa.id }, { authorization: TestAuthorizationLiterals.Az_Ua2User_OaMember, skipCache: true });
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(spyDbFindOne).toBeCalledTimes(2);
    });
  });

  //
  // -------------------------------------------
  //

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
