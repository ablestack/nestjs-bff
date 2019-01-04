import { getLogger } from '../../../../shared/logging/logging.shared.module';
import { TestingUtils } from '../../../../shared/utils/testing.utils';
import { FooEntity } from '../../__mocks__/foo/model/foo.entity';
import { EntityValidatorService } from './entity-validator.service';

// @ts-ignore
const logger = getLogger();

describe('GIVEN EntityValidator', () => {
  describe('validateEntity', () => {
    describe('UserAndOrgScopedEntityConditions', () => {
      const entityValidator = new EntityValidatorService(logger, FooEntity);

      it('WHEN all required parameters are provided, THEN should pass', async () => {
        const fooConditions = {
          slug: 'fooman',
          orgId: TestingUtils.generateMongoObjectIdString(),
          userId: TestingUtils.generateMongoObjectIdString(),
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

      it('WHEN orgId missing THEN should throw error', async () => {
        const fooConditions = {
          slug: 'fooman',
          userId: TestingUtils.generateMongoObjectIdString(),
        };

        let error: any;
        try {
          await entityValidator.validate(fooConditions);
        } catch (e) {
          error = e;
        }

        expect(error).not.toBeUndefined();
      });

      it('WHEN userId is undefined but userScope validation is overridden , THEN should pass', async () => {
        const fooConditions = {
          slug: 'fooman',
          orgId: TestingUtils.generateMongoObjectIdString(),
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

      it('WHEN userId missing THEN should throw error', async () => {
        const fooConditions = {
          slug: 'fooman',
          orgId: TestingUtils.generateMongoObjectIdString(),
        };

        let error: any;
        try {
          await entityValidator.validate(fooConditions);
        } catch (e) {
          error = e;
        }

        expect(error).not.toBeUndefined();
      });

      it('WHEN orgId is undefined but orgScope validation is overridden , THEN should pass', async () => {
        const fooConditions = {
          slug: 'fooman',
          orgId: undefined,
          userId: TestingUtils.generateMongoObjectIdString(),
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
