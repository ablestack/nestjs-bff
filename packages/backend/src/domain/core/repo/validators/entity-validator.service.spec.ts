import { getLogger } from '../../../../shared/logging/logging.shared.module';
import { TestingUtils } from '../../../../shared/utils/testing.utils';
import { FooEntity } from '../../__mocks__/foo/model/foo.entity';
import { EntityValidatorService } from './entity-validator.service';

const logger = getLogger();

describe('EntityValidator', () => {
  describe('validateEntity', () => {
    describe('for UserAndOrgScopedEntityConditions', () => {
      const entityValidator = new EntityValidatorService(logger, FooEntity);

      it('should pass if all required parameters are provided', async () => {
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
          logger.debug('error', { error, innerErrors: error.metaData.errors });
        }

        expect(error).toBeUndefined();
      });

      it('should throw an error if orgId missing', async () => {
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

      it('should throw an error if userId missing', async () => {
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
    });
  });
});
