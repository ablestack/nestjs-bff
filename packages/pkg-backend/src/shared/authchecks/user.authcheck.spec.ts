import { TestAuthorizationLiterals } from '../testing/test-literals.constants';
import { UserAuthCheck } from './user.authcheck';

//
// Global Scoped Variables Setup
//

// @ts-ignore
const logger = getLogger();

describe('GIVEN a UserAuthCheck', () => {
  let userAuthCheck: UserAuthCheck;

  beforeAll(async () => {
    userAuthCheck = new UserAuthCheck();
  });

  //
  // -------------------------------------------
  //

  // FindOne Tests

  //
  // -------------------------------------------
  //

  describe('WHEN calling isAuthorized', () => {
    it(`WITH no accessPermissions 
        THEN should return false`, async () => {
      let error;
      let result;

      try {
        result = await userAuthCheck.isAuthorized(null, { targetResource: TestScopedDataLiterals.Sc_Ua1Oa });
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
    it(`WITH valid accessPermissions 
        THEN should return true`, async () => {
      let error;
      let result;

      try {
        result = await userAuthCheck.isAuthorized(TestAuthorizationLiterals.Az_Ua1user_OaAdmin, { targetResource: TestScopedDataLiterals.Sc_Ua1Oa });
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
    it(`WITH null targetUserId 
        THEN should throw error`, async () => {
      let error;
      let result;

      try {
        result = await userAuthCheck.isAuthorized(TestAuthorizationLiterals.Az_Ua1user_OaAdmin, { targetResource: TestScopedDataLiterals.Sc_UxOa });
      } catch (e) {
        error = e;
      }

      expect(error).not.toBeUndefined();
      expect(result).not.toBe(true);
    });
  });
});
