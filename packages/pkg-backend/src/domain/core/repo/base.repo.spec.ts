import { OrganizationRoles, Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import * as cacheManager from 'cache-manager';
import * as mongoose from 'mongoose';
import { NestjsBffConfig } from '../../../config/nestjs-bff.config';
import { LoggerConsoleSharedService } from '../../../shared/logging/console-logger.shared.service';
import { getLogger } from '../../../shared/logging/logging.shared.module';
import { TestingUtils } from '../../../shared/utils/testing.utils';
import { IFooModel } from '../__mocks__/foo/model/foo.model';
import { FooSchema } from '../__mocks__/foo/model/foo.schema';
import { FooRepo } from '../__mocks__/foo/repo/foo.repo';

//
// Global Scoped Variables Setup
//

// @ts-ignore
const logger = getLogger();

const testOrgs = {
  orgA: {
    id: TestingUtils.generateMongoObjectIdString(),
    name: 'org A',
    slug: 'org-a',
  },
};

const testUsers = {
  userA1: {
    id: TestingUtils.generateMongoObjectIdString(),
    username: 'user A1',
    displayName: 'user-a1',
  },
};

const testEntities = {
  a1Foo: {
    id: TestingUtils.generateMongoObjectIdString(),
    name: 'Fooman Chu',
    slug: 'foo',
    orgId: testOrgs.orgA.id,
    userId: testUsers.userA1.id,
  },
};

const testAuthorization = {
  a1Auth: {
    userId: testUsers.userA1.id,
    roles: [Roles.user],
    organizations: [{ primary: true, orgId: testEntities.a1Foo.orgId, organizationRoles: [OrganizationRoles.member] }],
  },
};

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
        return testEntities.a1Foo;
      });

      try {
        result = await fooRepo.findOne({
          id: testEntities.a1Foo.id,
        });
      } catch (e) {
        error = e;
      }

      expect(error).not.toBeUndefined();
      expect(result).not.toBe(testEntities.a1Foo);
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
        return testEntities.a1Foo;
      });

      try {
        result = await fooRepo.findOne({ id: testEntities.a1Foo.id }, { authorization: testAuthorization.a1Auth });
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toBe(testEntities.a1Foo);
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
