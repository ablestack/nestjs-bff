import * as cacheManager from 'cache-manager';
import * as mongoose from 'mongoose';
import { NestjsBffConfig } from '../../../config/nestjs-bff.config';
import { LoggerConsoleSharedService } from '../../../shared/logging/console-logger.shared.service';
import { getLogger } from '../../../shared/logging/logging.shared.module';
import { TestingUtils } from '../../../shared/utils/testing.utils';
import { FooEntity } from '../__mocks__/foo/model/foo.entity';
import { IFooModel } from '../__mocks__/foo/model/foo.model';
import { FooSchema } from '../__mocks__/foo/model/foo.schema';
import { FooRepo } from '../__mocks__/foo/repo/foo.repo';
import { EntityValidator } from './validators/entity.validator';

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
    fooRepo = new FooRepo(loggerService, fooModel, memCache, NestjsBffConfig);
  });

  //
  // -------------------------------------------
  //

  // FindOne Tests

  //
  // -------------------------------------------
  //

  describe('WHEN findOne is called with an org scoped and user-scoped Repo', () => {
    it(`WITH valid conditions 
        THEN an entity should be returned`, async () => {
      const fooResult = {
        id: TestingUtils.generateMongoObjectIdString(),
        slug: 'fooman',
        orgId: TestingUtils.generateMongoObjectIdString(),
        userId: TestingUtils.generateMongoObjectIdString(),
      };

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindOne').mockImplementation(conditions => {
        return fooResult;
      });

      const result = await fooRepo.findOne({
        id: '507f191e810c19729de860ea',
        orgId: fooResult.orgId,
        userId: fooResult.userId,
      });
      expect(result).toBe(fooResult);
    });

    //
    // -------------------------------------------
    //

    it(`WITHOUT an orgId 
        THEN an error should be thrown`, async () => {
      let error;
      let result;

      const fooResult = {
        id: TestingUtils.generateMongoObjectIdString(),
        slug: 'fooman',
        userId: TestingUtils.generateMongoObjectIdString(),
      };

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFindOne').mockImplementation(conditions => {
        return fooResult;
      });

      try {
        result = await fooRepo.findOne({
          id: '507f191e810c19729de860ea',
          userId: fooResult.userId,
        });
      } catch (e) {
        error = e;
      }

      expect(error).not.toBeUndefined();
      expect(result).not.toBe(fooResult);
    });
  });

  //
  // -------------------------------------------
  //

  it(`WITHOUT an orgId
        WITH an entity-validator override
        THEN and entity should be returned`, async () => {
    let error;
    let result;

    const fooResult = {
      id: TestingUtils.generateMongoObjectIdString(),
      slug: 'fooman',
      userId: TestingUtils.generateMongoObjectIdString(),
    };

    // @ts-ignore
    jest.spyOn(fooRepo, '_dbFindOne').mockImplementation(conditions => {
      return fooResult;
    });

    try {
      result = await fooRepo.findOne(
        {
          id: '507f191e810c19729de860ea',
          userId: fooResult.userId,
        },
        { customValidator: new EntityValidator(logger, FooEntity) },
      );
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(result).toBe(fooResult);
  });

  //
  // -------------------------------------------
  //

  // Find Tests

  //
  // -------------------------------------------
  //

  describe('WHEN findMany is called with an org scoped and user-scoped Repo', () => {
    it(`WITH valid conditions 
        THEN an entity should be returned`, async () => {
      const fooResult = [
        {
          slug: 'fooman',
          orgId: TestingUtils.generateMongoObjectIdString(),
          userId: TestingUtils.generateMongoObjectIdString(),
        },
      ];

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFind').mockImplementation(conditions => {
        return fooResult;
      });

      const result = await fooRepo.find({
        orgId: fooResult[0].orgId,
        userId: fooResult[0].userId,
      });
      expect(result).toBe(fooResult);
    });

    //
    // -------------------------------------------
    //

    it(`WITHOUT an orgId 
        THEN an error should be thrown`, async () => {
      let error;
      let result;

      const fooResult = [
        {
          id: TestingUtils.generateMongoObjectIdString(),
          slug: 'fooman',
          userId: TestingUtils.generateMongoObjectIdString(),
        },
      ];

      // @ts-ignore
      jest.spyOn(fooRepo, '_dbFind').mockImplementation(conditions => {
        return fooResult;
      });

      try {
        result = await fooRepo.find({
          id: '507f191e810c19729de860ea',
          userId: fooResult[0].userId,
        });
      } catch (e) {
        error = e;
      }

      expect(error).not.toBeUndefined();
      expect(result).not.toBe(fooResult);
    });
  });

  //
  // -------------------------------------------
  //

  it(`WITHOUT an orgId
        WITH an entity-validator override
        THEN and entity should be returned`, async () => {
    let error;
    let result;

    const fooResult = [
      {
        id: TestingUtils.generateMongoObjectIdString(),
        slug: 'fooman',
        userId: TestingUtils.generateMongoObjectIdString(),
      },
    ];

    // @ts-ignore
    jest.spyOn(fooRepo, '_dbFind').mockImplementation(conditions => {
      return fooResult;
    });

    try {
      result = await fooRepo.find(
        {
          id: '507f191e810c19729de860ea',
          userId: fooResult[0].userId,
        },
        { customValidator: new EntityValidator(logger, FooEntity) },
      );
    } catch (e) {
      error = e;
    }

    expect(error).toBeUndefined();
    expect(result).toBe(fooResult);
  });
});

//
// -------------------------------------------
//

// Patch Tests

//
// -------------------------------------------
//

describe('WHEN Patch is called with an org scoped and user-scoped Repo', () => {
  it(`WITHOUT an orgId 
      THEN an error should be thrown`, async () => {
    let error;
    let result;

    const fooResult = [
      {
        id: TestingUtils.generateMongoObjectIdString(),
        slug: 'fooman',
        userId: TestingUtils.generateMongoObjectIdString(),
      },
    ];

    // @ts-ignore
    jest.spyOn(fooRepo, '_dbFind').mockImplementation(conditions => {
      return fooResult;
    });

    try {
      result = await fooRepo.find({
        id: '507f191e810c19729de860ea',
        userId: fooResult[0].userId,
      });
    } catch (e) {
      error = e;
    }

    expect(error).not.toBeUndefined();
    expect(result).not.toBe(fooResult);
  });
});

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
