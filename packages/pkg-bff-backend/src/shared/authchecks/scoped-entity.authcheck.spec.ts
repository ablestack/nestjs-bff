import { TestingUtils } from '@nestjs-bff/global-utils-dev/lib/testing.utils';
import { TestAuthorizationLiterals, TestFooEntityLiterals, TestOrgLiterals, TestUserLiterals } from '../testing/test-literals.constants';
import { ScopedEntityAuthCheck } from './scoped-entity.authcheck';

//
// Global Scoped Variables Setup
//
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
        WITH no accessPermissions 
        THEN should return false`, async () => {
      let error;
      let result;

      try {
        result = await scopedEntityAuthCheck.isAuthorized({
          accessPermissions: null,
          origin: __filename,
          targetResource: TestFooEntityLiterals.FE_Ua2Oa,
        });
      } catch (e) {
        error = e;
      }

      expect(error).toBeUndefined();
      expect(result).toBe(false);
    });

    //
    // -------------------------------------------
    //

    it(`WITH valid accessPermissions 
        WITH Org and User Scoped Entity
        THEN should return true`, async () => {
      let error;
      let result;

      try {
        result = await scopedEntityAuthCheck.isAuthorized({
          accessPermissions: TestAuthorizationLiterals.Az_Ua2User_OaMember,
          origin: __filename,
          targetResource: TestFooEntityLiterals.FE_Ua2Oa,
        });
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
        result = await scopedEntityAuthCheck.isAuthorized({
          accessPermissions: TestAuthorizationLiterals.Az_Ub1user_ObAdmin,
          origin: __filename,
          targetResource: TestFooEntityLiterals.FE_Ua2Oa,
        });
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
        result = await scopedEntityAuthCheck.isAuthorized({
          accessPermissions: TestAuthorizationLiterals.Az_Ua2User_OaMember,
          origin: __filename,
          targetResource: TestFooEntityLiterals.FE_Ua1Oa,
        });
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
        result = await scopedEntityAuthCheck.isAuthorized({
          accessPermissions: TestAuthorizationLiterals.Az_Ua1user_OaAdmin,
          origin: __filename,
          targetResource: TestFooEntityLiterals.FE_Ua2Oa,
        });
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
        result = await scopedEntityAuthCheck.isAuthorized({
          accessPermissions: TestAuthorizationLiterals.Az_Uc1GroupAdmin_OcMember_OaFacilitator,
          origin: __filename,
          targetResource: TestFooEntityLiterals.FE_Ua2Oa,
        });
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
        result = await scopedEntityAuthCheck.isAuthorized({
          accessPermissions: TestAuthorizationLiterals.Az_Uz2StaffAdmin_OzMember,
          origin: __filename,
          targetResource: TestFooEntityLiterals.FE_Ua2Oa,
        });
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
        result = await scopedEntityAuthCheck.isAuthorized({
          accessPermissions: TestAuthorizationLiterals.Az_Uz1SystemAdmin_OzMember,
          origin: __filename,
          targetResource: TestFooEntityLiterals.FE_Ua2Oa,
        });
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
        result = await scopedEntityAuthCheck.isAuthorized({
          accessPermissions: TestAuthorizationLiterals.Az_Ua2User_OaMember,
          origin: __filename,
          targetResource: orgScopedEntity,
        });
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
        result = await scopedEntityAuthCheck.isAuthorized({
          accessPermissions: TestAuthorizationLiterals.Az_Ua2User_OaMember,
          origin: __filename,
          targetResource: userScopedEntity,
        });
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
        result = await scopedEntityAuthCheck.isAuthorized({
          accessPermissions: TestAuthorizationLiterals.Az_Ua1user_OaAdmin,
          origin: __filename,
          targetResource: userScopedEntity,
        });
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
