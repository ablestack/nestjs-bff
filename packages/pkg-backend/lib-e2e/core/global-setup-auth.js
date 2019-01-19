"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const access_permissions_repo_1 = require("../../src/domain/access-permissions/repo/access-permissions.repo");
const authentication_entity_1 = require("../../src/domain/authentication/model/authentication.entity");
const authentication_repo_1 = require("../../src/domain/authentication/repo/authentication.repo");
const organization_repo_1 = require("../../src/domain/organization/repo/organization.repo");
const user_repo_1 = require("../../src/domain/user/repo/user.repo");
const logging_shared_module_1 = require("../../src/shared/logging/logging.shared.module");
const auth_e2e_module_1 = require("../auth/auth-e2e.module");
const test_object_literals_constants_1 = require("./test-object-literals.constants");
const authInitializer = new authentication_entity_1.AuthenticationEntity();
authInitializer.local = new authentication_entity_1.LocalAuth();
authInitializer.google = new authentication_entity_1.GoogleAuth();
authInitializer.facebook = new authentication_entity_1.FacebookAuth();
authInitializer.twitter = new authentication_entity_1.TwitterAuth();
exports.setupAuth = (globalConfig, nestJsBffConfig) => __awaiter(this, void 0, void 0, function* () {
    const logger = logging_shared_module_1.getLogger();
    //
    // Setup
    //
    const module = yield testing_1.Test.createTestingModule({
        imports: [auth_e2e_module_1.AuthE2eModule],
    }).compile();
    const app = module.createNestApplication();
    yield app.init();
    const authenticationRepo = yield app.get(authentication_repo_1.AuthenticationRepo);
    const organizationRepo = yield app.get(organization_repo_1.OrganizationRepo);
    const userRepo = yield app.get(user_repo_1.UserRepo);
    const accessPermissionsRepo = yield app.get(access_permissions_repo_1.AccessPermissionsRepo);
    //
    // Add Data
    //
    // OrgA
    yield organizationRepo.create(test_object_literals_constants_1.testData.orgA.orgEntity, { skipAuthorization: true });
    // OrgA Admin User
    yield userRepo.create(test_object_literals_constants_1.testData.orgA.users.adminUser.userEntity, { skipAuthorization: true });
    yield authenticationRepo.create(test_object_literals_constants_1.testData.orgA.users.adminUser.authenticationEntity, { skipAuthorization: true });
    yield accessPermissionsRepo.create(test_object_literals_constants_1.testData.orgA.users.adminUser.accessPermissionsEntity, {
        skipAuthorization: true,
    });
    // OrgA Regular User
    yield userRepo.create(test_object_literals_constants_1.testData.orgA.users.regularUser.userEntity, { skipAuthorization: true });
    yield authenticationRepo.create(test_object_literals_constants_1.testData.orgA.users.regularUser.authenticationEntity, { skipAuthorization: true });
    yield accessPermissionsRepo.create(test_object_literals_constants_1.testData.orgA.users.regularUser.accessPermissionsEntity, {
        skipAuthorization: true,
    });
    // OrgA
    yield organizationRepo.create(test_object_literals_constants_1.testData.orgB.orgEntity, { skipAuthorization: true });
    // OrgB Admin User
    yield userRepo.create(test_object_literals_constants_1.testData.orgB.users.adminUser.userEntity, { skipAuthorization: true });
    yield authenticationRepo.create(test_object_literals_constants_1.testData.orgB.users.adminUser.authenticationEntity, { skipAuthorization: true });
    yield accessPermissionsRepo.create(test_object_literals_constants_1.testData.orgB.users.adminUser.accessPermissionsEntity, {
        skipAuthorization: true,
    });
    // OrgC
    yield organizationRepo.create(test_object_literals_constants_1.testData.orgC.orgEntity, { skipAuthorization: true });
    // OrgC GroupAdmin User
    yield userRepo.create(test_object_literals_constants_1.testData.orgC.users.groupAdminUser.userEntity, { skipAuthorization: true });
    yield authenticationRepo.create(test_object_literals_constants_1.testData.orgC.users.groupAdminUser.authenticationEntity, { skipAuthorization: true });
    yield accessPermissionsRepo.create(test_object_literals_constants_1.testData.orgC.users.groupAdminUser.accessPermissionsEntity, {
        skipAuthorization: true,
    });
    // OrgZ
    yield organizationRepo.create(test_object_literals_constants_1.testData.orgZ.orgEntity, { skipAuthorization: true });
    // OrgZ SystemAdmin User
    yield userRepo.create(test_object_literals_constants_1.testData.orgZ.users.systemAdminUser.userEntity, { skipAuthorization: true });
    yield accessPermissionsRepo.create(test_object_literals_constants_1.testData.orgZ.users.systemAdminUser.accessPermissionsEntity, {
        skipAuthorization: true,
    });
    logger.info(`Users Created: ----------------------------------------------
    ${test_object_literals_constants_1.testData.orgA.users.adminUser.userEntity.username}, 
    ${test_object_literals_constants_1.testData.orgA.users.regularUser.userEntity.username},
    ${test_object_literals_constants_1.testData.orgB.users.adminUser.userEntity.username},
    ${test_object_literals_constants_1.testData.orgC.users.groupAdminUser.userEntity.username},
    ${test_object_literals_constants_1.testData.orgZ.users.systemAdminUser.userEntity.username}`);
});
//# sourceMappingURL=global-setup-auth.js.map