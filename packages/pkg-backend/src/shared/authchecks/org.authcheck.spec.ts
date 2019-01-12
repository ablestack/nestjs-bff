import { TestAuthorizationLiterals, TestScopedDataLiterals } from '../testing/test-literals.constants';
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
    it(`WITH no accessPermissions 
        THEN should return false`, async () => {
      let error;
      let result;

      try {
        result = await orgAuthCheck.isAuthorized({ accessPermissions: null, origin: __filename, targetResource: TestScopedDataLiterals.Sc_Ua2Oa });
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
        result = await orgAuthCheck.isAuthorized({
          accessPermissions: TestAuthorizationLiterals.Az_Ua2User_OaMember,
          origin: __filename,
          targetResource: TestScopedDataLiterals.Sc_Ua1Oa,
        });
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
        result = await orgAuthCheck.isAuthorized({
          accessPermissions: TestAuthorizationLiterals.Az_Ua1user_OaAdmin,
          origin: __filename,
          targetResource: TestScopedDataLiterals.Sc_Ua2Ox,
        });
      } catch (e) {
        error = e;
      }

      expect(error).not.toBeUndefined();
      expect(result).not.toBe(true);
    });
  });
});
