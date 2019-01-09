import { getLogger } from '../../../shared/logging/logging.shared.module';
import { TestingUtils } from '../../../shared/utils/testing.utils';
import { FooEntity } from '../../_foo/model/foo.entity';
import { EntityValidator } from './entity.validator';

// @ts-ignore
const logger = getLogger();

describe('GIVEN EntityValidator', () => {
  describe('validateEntity', () => {
    describe('UserAndOrgScopedEntityConditions', () => {
      const entityValidator = new EntityValidator(logger, FooEntity);

      it('WHEN all required parameters are provided, THEN should pass', async () => {
        const fooConditions = {
          orgId: TestingUtils.generateMongoObjectIdString(),
          userId: TestingUtils.generateMongoObjectIdString(),
          slug: 'fooman',
        };

        let error: any;
        try {
          await entityValidator.validate(fooConditions);
        } catch (e) {
          error = e;
          // logger.debug('error', { error, innerErrors: error.metaData.errors });
        }

        expect(error).toBeUndefined();
      });

      it('WHEN slug is missing THEN should throw error', async () => {
        const fooConditions = {
          orgId: TestingUtils.generateMongoObjectIdString(),
          userId: TestingUtils.generateMongoObjectIdString(),
          name: 'mr fooman',
        };

        let error: any;
        try {
          await entityValidator.validate(fooConditions);
        } catch (e) {
          error = e;
        }

        expect(error).not.toBeUndefined();
      });

      it('WHEN name is less than 5 characters THEN should throw error', async () => {
        const fooConditions = {
          orgId: TestingUtils.generateMongoObjectIdString(),
          userId: TestingUtils.generateMongoObjectIdString(),
          name: 'foo',
          slug: 'fooman',
        };

        let error: any;
        try {
          await entityValidator.validate(fooConditions);
        } catch (e) {
          error = e;
        }

        expect(error).not.toBeUndefined();
      });

      it('WHEN userId and orgId are undefined THEN should still pass', async () => {
        const fooConditions = {
          slug: 'fooman',
          userId: undefined,
        };

        let error: any;
        try {
          await entityValidator.validate(fooConditions);
        } catch (e) {
          error = e;
          // logger.debug('error', { error, innerErrors: error.metaData.errors });
        }

        expect(error).toBeUndefined();
      });
    });
  });
});
