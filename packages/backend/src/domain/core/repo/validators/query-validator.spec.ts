import { getLogger } from '../../../../shared/logging/logging.shared.module';
import { FooQueryConditions } from '../__mocks__/foo/repo/foo.query-conditions';
import { QueryValidatorService } from './query-validator.service';

const logger = getLogger();

describe('QueryValidator', () => {
  describe('validateQuery', () => {
    describe('for UserAndOrgScopedQueryConditions', () => {
      const queryValidator = new QueryValidatorService(logger);

      it('should throw an error if orgId missing', async () => {
        const fooConditions = {
          slug: 'fooman',
        };

        expect(
          queryValidator.validateQuery<FooQueryConditions>(fooConditions),
        ).toThrowError();
      });
    });
  });
});
