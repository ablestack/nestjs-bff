import { getLogger } from '../../../../shared/logging/logging.shared.module';
import { TestingUtils } from '../../../../shared/utils/testing.utils';
import { FooQueryConditions } from '../__mocks__/foo/repo/foo.query-conditions';
import { QueryValidatorService } from './query-validator.service';

const logger = getLogger();

describe('QueryValidator', () => {
  describe('validateQuery', () => {
    describe('for UserAndOrgScopedQueryConditions', () => {
      const queryValidator = new QueryValidatorService(logger);

      it('should pass if all required parameters are provided', async () => {
        const fooConditions = {
          slug: 'fooman',
          orgId: TestingUtils.generateMongoObjectIdString(),
          uerId: TestingUtils.generateMongoObjectIdString(),
        };

        expect(() => queryValidator.validateQuery<FooQueryConditions>(fooConditions)).not.toThrow();
      });

      it('should throw an error if orgId missing', async () => {
        const fooConditions = {
          slug: 'fooman',
          uerId: TestingUtils.generateMongoObjectIdString(),
        };

        expect(() => queryValidator.validateQuery<FooQueryConditions>(fooConditions)).toThrowError();
      });

      it('should throw an error if userId missing', async () => {
        const fooConditions = {
          slug: 'fooman',
          orgId: TestingUtils.generateMongoObjectIdString(),
        };

        expect(() => queryValidator.validateQuery<FooQueryConditions>(fooConditions)).toThrowError();
      });
    });
  });
});
