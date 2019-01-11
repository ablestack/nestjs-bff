import * as cacheManager from 'cache-manager';
import _ = require('lodash');
import * as mongoose from 'mongoose';
import { NestjsBffConfig } from '../../../config/nestjs-bff.config';
import { CacheStore } from '../../../shared/caching/cache-store.shared';
import { AppError } from '../../../shared/exceptions/app.exception';
import { AuthorizationError } from '../../../shared/exceptions/authorization.exception';
import { ValidationError } from '../../../shared/exceptions/validation.exception';
import { LoggerConsoleSharedService } from '../../../shared/logging/console-logger.shared.service';
import { LoggerSharedService } from '../../../shared/logging/logger.shared.service';
import { getLogger } from '../../../shared/logging/logging.shared.module';
import { TestingUtils } from '../../../shared/utils/testing.utils';
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
        return TestFooEntityLiterals.FE_Ua2Oa;
      });

      try {
        result = await fooRepo.findOne({ id: TestFooEntityLiterals.FE_Ua2Oa.id }, { authorizationScope: TestAuthorizationLiterals.Az_Ua2User_OaMember });
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toEqual(TestFooEntityLiterals.FE_Ua2Oa);
    });

    //
    // -------------------------------------------
    //

    it(`WITH valid authorization
        FOR an entity that does not exist 
        THEN an error should be thrown`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindOne').mockImplementation(conditions => {
        return null;
      });

      try {
        result = await fooRepo.findOne({ id: TestFooEntityLiterals.FE_Ua2Oa.id }, { authorizationScope: TestAuthorizationLiterals.Az_Ua2User_OaMember });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(AppError);
      expect(result).toBeUndefined();
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
        return TestFooEntityLiterals.FE_Ua2Oa;
      });

      try {
        result = await fooRepo.findOne({
          id: TestFooEntityLiterals.FE_Ua2Oa.id,
        });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(AuthorizationError);
      expect(result).toBeUndefined();
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
        return TestFooEntityLiterals.FE_Ua2Oa;
      });

      try {
        result = await fooRepo.findOne(
          {
            id: TestFooEntityLiterals.FE_Ua2Oa.id,
          },
          { skipAuthorization: true },
        );
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toEqual(TestFooEntityLiterals.FE_Ua2Oa);
    });
  });

  //
  // -------------------------------------------
  // -------------------------------------------
  //

  describe('WHEN find is called twice with an org-scoped and user-scoped Repo', () => {
    it(`WITH valid authorization 
        THEN _dbFindOne should only be triggered once (the other is from cache) `, async () => {
      let error;

      // @ts-ignore
      const spyDbFindOne = jest.spyOn(fooRepo, '_dbFindOne').mockImplementation(conditions => {
        return TestFooEntityLiterals.FE_Ua2Oa;
      });

      try {
        await fooRepo.findOne({ id: TestFooEntityLiterals.FE_Ua2Oa.id }, { authorizationScope: TestAuthorizationLiterals.Az_Ua2User_OaMember });
        await fooRepo.findOne({ id: TestFooEntityLiterals.FE_Ua2Oa.id }, { authorizationScope: TestAuthorizationLiterals.Az_Ua2User_OaMember });
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
        return TestFooEntityLiterals.FE_Ua2Oa;
      });

      try {
        await fooRepo.findOne({ id: TestFooEntityLiterals.FE_Ua2Oa.id }, { authorizationScope: TestAuthorizationLiterals.Az_Ua2User_OaMember, skipCache: true });
        await fooRepo.findOne({ id: TestFooEntityLiterals.FE_Ua2Oa.id }, { authorizationScope: TestAuthorizationLiterals.Az_Ua2User_OaMember, skipCache: true });
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

  describe('WHEN find is called with an org-scoped and user-scoped Repo', () => {
    it(`WITH valid authorization 
        THEN a Foo array should be returned`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFind').mockImplementation(conditions => {
        return [TestFooEntityLiterals.FE_Ua2Oa];
      });

      try {
        result = await fooRepo.find({ name: TestFooEntityLiterals.FE_Ua2Oa.name }, { authorizationScope: TestAuthorizationLiterals.Az_Ua2User_OaMember });
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toEqual([TestFooEntityLiterals.FE_Ua2Oa]);
    });

    //
    // -------------------------------------------
    //

    it(`WITH valid authorization
        FOR no matching entities 
        THEN an empty array should be returned`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFind').mockImplementation(conditions => {
        return [];
      });

      try {
        result = await fooRepo.find({ id: TestFooEntityLiterals.FE_Ua2Oa.id }, { authorizationScope: TestAuthorizationLiterals.Az_Ua2User_OaMember });
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toEqual([]);
    });

    //
    // -------------------------------------------
    //

    it(`WITH no authorization 
        THEN an error should be thrown`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFind').mockImplementation(conditions => {
        return [TestFooEntityLiterals.FE_Ua2Oa];
      });

      try {
        result = await fooRepo.find({ name: TestFooEntityLiterals.FE_Ua2Oa.name });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(AuthorizationError);
      expect(result).toBeUndefined();
    });

    //
    // -------------------------------------------
    //

    it(`WITH no authorization
        WITH options.skipAuthorization = true 
        THEN an Foo array should be returned`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFind').mockImplementation(conditions => {
        return [TestFooEntityLiterals.FE_Ua2Oa];
      });

      try {
        result = await fooRepo.find({ name: TestFooEntityLiterals.FE_Ua2Oa.name }, { skipAuthorization: true });
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toEqual([TestFooEntityLiterals.FE_Ua2Oa]);
    });
  });

  //
  // -------------------------------------------
  // -------------------------------------------
  //

  describe('WHEN find is called twice with an org-scoped and user-scoped Repo', () => {
    it(`WITH valid authorization 
        THEN _dbFind should only be triggered once (the other is from cache) `, async () => {
      let error;

      // @ts-ignore
      const spyDbFind = jest.spyOn(fooRepo, '_dbFind').mockImplementation(conditions => {
        return [TestFooEntityLiterals.FE_Ua2Oa];
      });

      try {
        await fooRepo.find({ name: TestFooEntityLiterals.FE_Ua2Oa.name }, { authorizationScope: TestAuthorizationLiterals.Az_Ua2User_OaMember });
        await fooRepo.find({ name: TestFooEntityLiterals.FE_Ua2Oa.name }, { authorizationScope: TestAuthorizationLiterals.Az_Ua2User_OaMember });
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(spyDbFind).toBeCalledTimes(1);
    });

    //
    // -------------------------------------------
    //

    it(`WITH valid authorization
        AND options.skipCache = true 
        THEN _dbFind should be triggered twice (cache not used) `, async () => {
      let error;

      // @ts-ignore
      const spyDbFind = jest.spyOn(fooRepo, '_dbFind').mockImplementation(conditions => {
        return [TestFooEntityLiterals.FE_Ua2Oa];
      });

      try {
        await fooRepo.find({ name: TestFooEntityLiterals.FE_Ua2Oa.name }, { authorizationScope: TestAuthorizationLiterals.Az_Ua2User_OaMember, skipCache: true });
        await fooRepo.find({ name: TestFooEntityLiterals.FE_Ua2Oa.name }, { authorizationScope: TestAuthorizationLiterals.Az_Ua2User_OaMember, skipCache: true });
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(spyDbFind).toBeCalledTimes(2);
    });
  });

  //
  // -------------------------------------------
  //

  // Create Tests

  //
  // -------------------------------------------
  //

  describe('WHEN create is called with an org-scoped and user-scoped Repo', () => {
    it(`WITH valid authorization 
        THEN a Foo should be returned`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbSave').mockImplementation(entity => {
        return entity;
      });

      const newFoo = _.clone(TestFooEntityLiterals.FE_Ua2Oa);
      newFoo.id = '';

      try {
        result = await fooRepo.create(newFoo, { authorizationScope: TestAuthorizationLiterals.Az_Ua2User_OaMember });
      } catch (e) {
        error = e;
      }

      // delete id, to prep object for comparison
      delete newFoo.id;

      expect(error).toBeUndefined();
      expect(TestingUtils.objectIdsToStrings(result)).toMatchObject(newFoo);
    });

    //
    // -------------------------------------------
    //

    it(`WITH no authorization 
        THEN an error should be thrown`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbSave').mockImplementation(entity => {
        return entity;
      });

      const newFoo = _.clone(TestFooEntityLiterals.FE_Ua2Oa);
      newFoo.id = '';

      try {
        result = await fooRepo.create(newFoo);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(AuthorizationError);
      expect(result).toBeUndefined();
    });

    //
    // -------------------------------------------
    //

    it(`WITH invalid authorization 
        THEN an error should be thrown`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbSave').mockImplementation(entity => {
        return entity;
      });

      const newFoo = _.clone(TestFooEntityLiterals.FE_Ua2Oa);
      newFoo.id = '';

      try {
        result = await fooRepo.create(newFoo, { authorizationScope: TestAuthorizationLiterals.Az_Ub1user_ObAdmin });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(AuthorizationError);
      expect(result).toBeUndefined();
    });
  });

  //
  // -------------------------------------------
  //

  // Patch Tests

  //
  // -------------------------------------------
  //

  describe('WHEN patch is called with an org-scoped and user-scoped Repo', () => {
    it(`WITH valid authorization 
        THEN a Foo should be returned`, async () => {
      let error;
      let result;
      const fooToBeUpdated = _.clone(TestFooEntityLiterals.FE_Ua2Oa);

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindById').mockImplementation(entityId => {
        return fooToBeUpdated;
      });

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbSave').mockImplementation(entity => {
        return entity;
      });

      const patchFoo = {
        id: fooToBeUpdated.id,
        name: fooToBeUpdated.name + ' updated',
      };

      try {
        result = await fooRepo.patch(patchFoo, { authorizationScope: TestAuthorizationLiterals.Az_Ua2User_OaMember });
      } catch (e) {
        error = e;
      }

      const expectedFoo = fooToBeUpdated;
      expectedFoo.name = expectedFoo.name + ' updated';

      expect(error).toBeUndefined();
      expect(TestingUtils.objectIdsToStrings(result)).toMatchObject(expectedFoo);
    });

    //
    // -------------------------------------------
    //

    it(`WITH no authorization 
        THEN an error should be thrown`, async () => {
      let error;
      let result;
      const fooToBeUpdated = _.clone(TestFooEntityLiterals.FE_Ua2Oa);

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindById').mockImplementation(entityId => {
        return fooToBeUpdated;
      });

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbSave').mockImplementation(entity => {
        return entity;
      });

      const patchFoo = {
        id: fooToBeUpdated.id,
        name: fooToBeUpdated.name + ' updated',
      };

      try {
        result = await fooRepo.patch(patchFoo);
      } catch (e) {
        error = e;
      }

      const expectedFoo = fooToBeUpdated;
      expectedFoo.name = expectedFoo.name + ' updated';

      expect(error).toBeInstanceOf(AuthorizationError);
      expect(result).toBeUndefined();
    });

    //
    // -------------------------------------------
    //

    it(`WITH invalid authorization 
        THEN an error should be thrown`, async () => {
      let error;
      let result;
      const fooToBeUpdated = _.clone(TestFooEntityLiterals.FE_Ua2Oa);

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindById').mockImplementation(entityId => {
        return fooToBeUpdated;
      });

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbSave').mockImplementation(entity => {
        return entity;
      });

      const patchFoo = {
        id: fooToBeUpdated.id,
        name: fooToBeUpdated.name + ' updated',
      };

      try {
        result = await fooRepo.patch(patchFoo, { authorizationScope: TestAuthorizationLiterals.Az_Ub1user_ObAdmin });
      } catch (e) {
        error = e;
        // logger.debug('patch error', JSON.stringify(error, null, 2));
      }

      const expectedFoo = fooToBeUpdated;
      expectedFoo.name = expectedFoo.name + ' updated';

      expect(error).toBeInstanceOf(AuthorizationError);
      expect(result).toBeUndefined();
    });
  });

  //
  // -------------------------------------------
  //

  // Update Tests

  //
  // -------------------------------------------
  //

  describe('WHEN update is called with an org-scoped and user-scoped Repo', () => {
    it(`WITH valid authorization 
        THEN a Foo should be returned`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindOneAndReplace').mockImplementation(entity => {
        return entity;
      });

      try {
        result = await fooRepo.update(TestFooEntityLiterals.FE_Ua2Oa, { authorizationScope: TestAuthorizationLiterals.Az_Ua2User_OaMember });
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(TestingUtils.objectIdsToStrings(result)).toMatchObject(TestFooEntityLiterals.FE_Ua2Oa);
    });

    //
    // -------------------------------------------
    //

    it(`WITH no orgId 
        THEN a validation error should be thrown`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindOneAndReplace').mockImplementation(entity => {
        return entity;
      });

      const fooWithMissingOrgId = _.clone(TestFooEntityLiterals.FE_Ua2Oa);
      delete fooWithMissingOrgId.orgId;

      try {
        result = await fooRepo.update(fooWithMissingOrgId, { authorizationScope: TestAuthorizationLiterals.Az_Ua2User_OaMember });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(ValidationError);
      expect(result).toBeUndefined();
    });

    //
    // -------------------------------------------
    //

    it(`WITH no authorization 
        THEN an authorization error should be thrown`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindOneAndReplace').mockImplementation(entity => {
        return entity;
      });

      try {
        result = await fooRepo.update(TestFooEntityLiterals.FE_Ua2Oa);
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(AuthorizationError);
      expect(result).toBeUndefined();
    });

    //
    // -------------------------------------------
    //

    it(`WITH invalid authorization 
        THEN an authorization error should be thrown`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindOneAndReplace').mockImplementation(entity => {
        return entity;
      });

      try {
        result = await fooRepo.update(TestFooEntityLiterals.FE_Ua2Oa, { authorizationScope: TestAuthorizationLiterals.Az_Ub1user_ObAdmin });
      } catch (e) {
        error = e;
      }

      expect(error).toBeInstanceOf(AuthorizationError);
      expect(result).toBeUndefined();
    });
  });

  //
  // -------------------------------------------
  //

  // Delete Tests

  //
  // -------------------------------------------
  //
  describe('WHEN delete is called with an id for an org-scoped and user-scoped Repo', () => {
    it(`WITH valid authorization 
        THEN a Foo should be returned`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindById').mockImplementation(entityId => {
        return TestFooEntityLiterals.FE_Ua2Oa;
      });

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbRemove').mockImplementation(entity => {
        return entity;
      });

      try {
        result = await fooRepo.delete(TestFooEntityLiterals.FE_Ua2Oa.id, { authorizationScope: TestAuthorizationLiterals.Az_Ua2User_OaMember });
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(TestingUtils.objectIdsToStrings(result)).toMatchObject(TestFooEntityLiterals.FE_Ua2Oa);
    });

    //
    // -------------------------------------------
    //

    it(`WITH valid groupAdmin authorization 
    THEN a Foo should be returned`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindById').mockImplementation(entityId => {
        return TestFooEntityLiterals.FE_Ua2Oa;
      });

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbRemove').mockImplementation(entity => {
        return entity;
      });

      try {
        result = await fooRepo.delete(TestFooEntityLiterals.FE_Ua2Oa.id, { authorizationScope: TestAuthorizationLiterals.Az_Uc1GroupAdmin_OcMember_OaFacilitator });
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(TestingUtils.objectIdsToStrings(result)).toMatchObject(TestFooEntityLiterals.FE_Ua2Oa);
    });

    //
    // -------------------------------------------
    //

    it(`WITH no authorization 
        THEN an authorization error should be thrown`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindById').mockImplementation(entityId => {
        return TestFooEntityLiterals.FE_Ua2Oa;
      });

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbRemove').mockImplementation(entity => {
        return entity;
      });

      try {
        result = await fooRepo.delete(TestFooEntityLiterals.FE_Ua2Oa.id);
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(AuthorizationError);
      expect(result).toBeUndefined();
    });

    //
    // -------------------------------------------
    //

    it(`WITH invalid authorization 
        THEN an authorization error should be thrown`, async () => {
      let error;
      let result;

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindById').mockImplementation(entityId => {
        return TestFooEntityLiterals.FE_Ua2Oa;
      });

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbRemove').mockImplementation(entity => {
        return entity;
      });

      try {
        result = await fooRepo.delete(TestFooEntityLiterals.FE_Ua2Oa.id, { authorizationScope: TestAuthorizationLiterals.Az_Ub1user_ObAdmin });
      } catch (e) {
        error = e;
      }
      expect(error).toBeInstanceOf(AuthorizationError);
      expect(result).toBeUndefined();
    });
  });
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
