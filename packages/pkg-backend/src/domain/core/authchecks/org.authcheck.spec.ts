import { getLogger } from '../../../shared/logging/logging.shared.module';
import { TestAuthorizationLiterals, TestScopedDataLiterals } from '../_/test-literals.constants';
import { OrgAuthCheck } from './org.authcheck';

//
// Global Scoped Variables Setup
//

// @ts-ignore
const logger = getLogger();

describe('GIVEN a OrgAuthCheck', () => {
  let orgAuthCheck: OrgAuthCheck;

  beforeAll(async () => {
    orgAuthCheck = new OrgAuthCheck();
  });

  //
  // -------------------------------------------
  //

  // FindOne Tests

  //
  // -------------------------------------------
  //

  describe('WHEN calling isAuthorized', () => {
    it(`WITH no authorizationScope 
        THEN should return false`, async () => {
      let error;
      let result;

      try {
        result = await orgAuthCheck.isAuthorized(null, TestScopedDataLiterals.Sc_Ua2Oa);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toBe(false);
    });
  });

  //
  // -------------------------------------------
  //

  describe('WHEN calling isAuthorized', () => {
    it(`WITH valid authorizationScope 
        THEN should return true`, async () => {
      let error;
      let result;

      try {
        result = await orgAuthCheck.isAuthorized(TestAuthorizationLiterals.Az_Ua2User_OaMember, TestScopedDataLiterals.Sc_Ua1Oa);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toBe(true);
    });
  });

  //
  // -------------------------------------------
  //

  describe('WHEN calling isAuthorized', () => {
    it(`WITH null targetOrgId 
        THEN should throw error`, async () => {
      let error;
      let result;

      try {
        result = await orgAuthCheck.isAuthorized(TestAuthorizationLiterals.Az_Ua1user_OaAdmin, TestScopedDataLiterals.Sc_Ua2Ox);
      } catch (e) {
        error = e;
      }

      expect(error).not.toBeUndefined();
      expect(result).not.toBe(true);
    });
  });
});
