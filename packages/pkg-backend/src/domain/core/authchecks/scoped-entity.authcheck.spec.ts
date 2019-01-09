import { getLogger } from '../../../shared/logging/logging.shared.module';
import { TestingUtils } from '../../../shared/utils/testing.utils';
import { TestAuthorizationLiterals, TestFooEntityLiterals, TestOrgLiterals, TestUserLiterals } from '../_/test-literals.constants';
import { ScopedEntityAuthCheck } from './scoped-entity.authcheck';

//
// Global Scoped Variables Setup
//

// @ts-ignore
const logger = getLogger();

describe('GIVEN a ScopedEntityAuthCheck', () => {
  let scopedEntityAuthCheck: ScopedEntityAuthCheck;

  beforeAll(async () => {
    scopedEntityAuthCheck = new ScopedEntityAuthCheck();
  });

  //
  // -------------------------------------------
  //

  // FindOne Tests

  //
  // -------------------------------------------
  //

  describe('WHEN calling isAuthorized', () => {
    it(`WITH Org and User Scoped Entity
        WITH no credentials 
        THEN should return false`, async () => {
      let error;
      let result;

      try {
        result = await scopedEntityAuthCheck.isAuthorized(null, TestFooEntityLiterals.FE_Ua2Oa);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toBe(false);
    });

    //
    // -------------------------------------------
    //

    it(`WITH valid credentials 
        WITH Org and User Scoped Entity
        THEN should return true`, async () => {
      let error;
      let result;

      try {
        result = await scopedEntityAuthCheck.isAuthorized(TestAuthorizationLiterals.Az_Ua2User_OaMember, TestFooEntityLiterals.FE_Ua2Oa);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toBe(true);
    });

    //
    // -------------------------------------------
    //

    it(`WITH Org and User Scoped Entity
        WITH authorization that doesn't match userId
        WITH authorization that doesn't match orgId
        THEN should return false`, async () => {
      let error;
      let result;

      try {
        result = await scopedEntityAuthCheck.isAuthorized(TestAuthorizationLiterals.Az_Ub1user_ObAdmin, TestFooEntityLiterals.FE_Ua2Oa);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toBe(false);
    });

    //
    // -------------------------------------------
    //

    it(`WITH Org and User Scoped Entity
        WITH authorization that doesn't match userId
        WITH OrgRole -> user on related Org
        THEN should return false`, async () => {
      let error;
      let result;

      try {
        result = await scopedEntityAuthCheck.isAuthorized(TestAuthorizationLiterals.Az_Ua2User_OaMember, TestFooEntityLiterals.FE_Ua1Oa);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toBe(false);
    });

    //
    // -------------------------------------------
    //

    it(`WITH Org and User Scoped Entity
        WITH authorization that doesn't match userId
        WITH OrgRole -> admin on related Org
        THEN should return true`, async () => {
      let error;
      let result;

      try {
        result = await scopedEntityAuthCheck.isAuthorized(TestAuthorizationLiterals.Az_Ua1user_OaAdmin, TestFooEntityLiterals.FE_Ua2Oa);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toBe(true);
    });

    //
    // -------------------------------------------
    //

    it(`WITH Org and User Scoped Entity
        WITH authorization that doesn't match userId
        WITH Role -> groupAdmin
        WITH OrgRole -> facilitator on the related organization
        THEN should return true`, async () => {
      let error;
      let result;

      try {
        result = await scopedEntityAuthCheck.isAuthorized(TestAuthorizationLiterals.Az_Uc1GroupAdmin_OcMember_OaFacilitator, TestFooEntityLiterals.FE_Ua2Oa);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toBe(true);
    });

    //
    // -------------------------------------------
    //

    it(`WITH Org and User Scoped Entity
        WITH authorization that doesn't match userId
        WITH Role -> staffAdmin
        THEN should return true`, async () => {
      let error;
      let result;

      try {
        result = await scopedEntityAuthCheck.isAuthorized(TestAuthorizationLiterals.Az_Uz2StaffAdmin_OzMember, TestFooEntityLiterals.FE_Ua2Oa);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toBe(true);
    });

    //
    // -------------------------------------------
    //

    it(`WITH Org and User Scoped Entity
        WITH authorization that doesn't match userId
        WITH Role -> systemAdmin 
        THEN should return true`, async () => {
      let error;
      let result;

      try {
        result = await scopedEntityAuthCheck.isAuthorized(TestAuthorizationLiterals.Az_Uz1SystemAdmin_OzMember, TestFooEntityLiterals.FE_Ua2Oa);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toBe(true);
    });

    //
    // -------------------------------------------
    //

    it(`WITH Org Scoped Entity
        WITH authorization that does match the OrgId -> OrgRole user
        THEN should return true`, async () => {
      let error;
      let result;

      const orgScopedEntity = {
        id: TestingUtils.generateMongoObjectIdString(),
        orgId: TestOrgLiterals.Oa.id,
      };

      try {
        result = await scopedEntityAuthCheck.isAuthorized(TestAuthorizationLiterals.Az_Ua2User_OaMember, orgScopedEntity);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toBe(true);
    });

    //
    // -------------------------------------------
    //

    it(`WITH User Scoped Entity
        WITH authorization that matches the UserId
        THEN should return true`, async () => {
      let error;
      let result;

      const userScopedEntity = {
        id: TestingUtils.generateMongoObjectIdString(),
        userId: TestUserLiterals.Ua2.id,
      };

      try {
        result = await scopedEntityAuthCheck.isAuthorized(TestAuthorizationLiterals.Az_Ua2User_OaMember, userScopedEntity);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toBe(true);
    });

    //
    // -------------------------------------------
    //

    it(`WITH User Scoped Entity
        WITH authorization that does not match the UserId
        WITH orgAdmin for owning user
        THEN should return false`, async () => {
      let error;
      let result;

      const userScopedEntity = {
        id: TestingUtils.generateMongoObjectIdString(),
        userId: TestUserLiterals.Ua2.id,
      };

      try {
        result = await scopedEntityAuthCheck.isAuthorized(TestAuthorizationLiterals.Az_Ua1user_OaAdmin, userScopedEntity);
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();

      // note: this should still fail because it is impossible to verify access through org role, if entity not org scoped
      expect(result).toBe(false);
    });

    //
    // -------------------------------------------
    //
  });
});
