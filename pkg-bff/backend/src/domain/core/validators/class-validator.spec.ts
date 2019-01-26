import { IEntity } from '@nestjs-bff/global-contracts/lib/domain/core/entity.interface';
import { ValidationError } from '../../../shared/exceptions/validation.exception';
import { getLogger } from '../../../shared/logging/logging.shared.module';
import { TestingUtils } from '@nestjs-bff/global-utils-dev/lib/testing.utils';
import { FooEntity } from '../../_foo/model/foo.entity';
import { ClassValidator } from './class-validator';

// @ts-ignore
const logger = getLogger();

describe('GIVEN ClassValidator', () => {
  const entityValidator = new ClassValidator<IEntity>(logger, FooEntity);
  describe('validateEntity', () => {
    describe('UserAndOrgScopedEntityConditions', () => {
      it('WHEN all required parameters are provided, THEN should pass', async () => {
        const foo = {
          id: TestingUtils.generateMongoObjectIdString(),
          orgId: TestingUtils.generateMongoObjectIdString(),
          userId: TestingUtils.generateMongoObjectIdString(),
          alwaysDefinedSlug: 'fooman',
        };

        let error: any;
        try {
          await entityValidator.validate(foo);
        } catch (e) {
          error = e;
          // logger.debug('error', { error, innerErrors: error.metaData.errors });
        }

        expect(error).toBeUndefined();
      });

      it('WHEN alwaysDefinedSlug is missing THEN should throw error', async () => {
        const fooEntity = {
          id: TestingUtils.generateMongoObjectIdString(),
          orgId: TestingUtils.generateMongoObjectIdString(),
          userId: TestingUtils.generateMongoObjectIdString(),
          name: 'Mr Fooman',
        };

        let error: any;
        try {
          await entityValidator.validate(fooEntity);
        } catch (e) {
          error = e;
        }

        expect(error).toBeInstanceOf(ValidationError);
      });

      it('WHEN name is less than 5 characters THEN should throw error', async () => {
        const fooEntity = {
          id: TestingUtils.generateMongoObjectIdString(),
          orgId: TestingUtils.generateMongoObjectIdString(),
          userId: TestingUtils.generateMongoObjectIdString(),
          name: 'Foo',
          alwaysDefinedSlug: 'fooman',
        };

        let error: any;
        try {
          await entityValidator.validate(fooEntity);
        } catch (e) {
          error = e;
        }

        expect(error).toBeInstanceOf(ValidationError);
      });

      it('WHEN userId and orgId are undefined THEN should still pass', async () => {
        const fooEntity = {
          id: TestingUtils.generateMongoObjectIdString(),
          alwaysDefinedSlug: 'fooman',
          userId: undefined,
        };

        let error: any;
        try {
          await entityValidator.validate(fooEntity);
        } catch (e) {
          error = e;
          // logger.debug('error', { error, innerErrors: error.metaData.errors });
        }

        expect(error).toBeUndefined();
      });

      it(`WHEN userId and orgId are undefined 
          AND validationOptions.skipMissingProperties = false
          THEN should throw error`, async () => {
        const fooEntity = {
          id: TestingUtils.generateMongoObjectIdString(),
          alwaysDefinedSlug: 'fooman',
          name: 'Mr Fooman',
        };

        let error: any;
        try {
          await entityValidator.validate(fooEntity, { skipMissingProperties: false });
        } catch (e) {
          error = e;
          // logger.debug('error', JSON.stringify(error, null, 2));
        }

        expect(error).toBeInstanceOf(ValidationError);
      });

      it(`WHEN orgId is undefined 
          AND validationOptions.skipMissingProperties = false
          THEN should throw error`, async () => {
        const fooEntity = {
          id: TestingUtils.generateMongoObjectIdString(),
          alwaysDefinedSlug: 'fooman',
          userId: TestingUtils.generateMongoObjectIdString(),
          name: 'Mr Fooman',
        };

        let error: any;
        try {
          await entityValidator.validate(fooEntity, { skipMissingProperties: false });
        } catch (e) {
          error = e;
          // logger.debug('error', JSON.stringify(error, null, 2));
        }

        expect(error).toBeInstanceOf(ValidationError);
      });
    });
  });
});
