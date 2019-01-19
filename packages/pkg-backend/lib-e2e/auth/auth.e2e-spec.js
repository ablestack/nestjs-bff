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
require("jest");
const supertest = require("supertest");
const nestjs_bff_config_1 = require("../../src/config/nestjs-bff.config");
const logging_shared_module_1 = require("../../src/shared/logging/logging.shared.module");
const test_object_literals_constants_1 = require("../core/test-object-literals.constants");
const auth_e2e_module_1 = require("./auth-e2e.module");
// Config
// @ts-ignore
global.nestjs_bff = { NestjsBffConfig: nestjs_bff_config_1.NestjsBffConfig };
describe('Auth', () => {
    let app;
    let httpServer;
    // @ts-ignore
    const logger = logging_shared_module_1.getLogger();
    //
    // Setup mock data & services
    //
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        logger.trace('---- Starting Auth e2e ----');
        yield test_object_literals_constants_1.setupTestDataJwtTokens(nestjs_bff_config_1.NestjsBffConfig);
        // console.log('Auth-testData', JSON.stringify(testData, null, 2));
        const module = yield testing_1.Test.createTestingModule({
            imports: [auth_e2e_module_1.AuthE2eModule],
        }).compile();
        app = module.createNestApplication();
        yield app.init();
        httpServer = app.getHttpServer();
    }), 5 * 60 * 1000);
    //
    // Run tests
    //
    it(`GIVEN an unauthenticated user
  WHEN incorrect signin data is posted to the signin endpoint
  THEN the user is not authenticated, and an appropriate error message is returned`, () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest(httpServer)
            .post('/auth/public/local/signin')
            .send({
            username: test_object_literals_constants_1.testData.orgA.users.adminUser.userEntity.username,
            password: 'bad-password',
        });
        expect(response.status).toEqual(400);
        expect(response.type).toBe('application/json');
        expect(response.body).not.toHaveProperty('token');
        expect(response.error).toBeDefined();
    }));
    it(`GIVEN an unauthenticated user
        WHEN correct signin data is posted to the signin endpoint
        THEN the user is successfully authenticated and receives a JWT token`, () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest(httpServer)
            .post('/auth/public/local/signin')
            .send({
            username: test_object_literals_constants_1.testData.orgA.users.adminUser.userEntity.username,
            password: test_object_literals_constants_1.testData.orgA.users.adminUser.password,
        });
        expect(response.status).toEqual(201);
        expect(response.type).toBe('application/json');
        expect(response.body).toHaveProperty('token');
        expect(response.body.token).toBeDefined();
        expect(token => token && token.length > 150);
    }));
    //
    // Authentication
    //
    it(`GIVEN an unauthenticated user with no auth token 
        WHEN a GET request is made for public data 
        THEN the request succeeds`, () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest(httpServer).get('/auth/public/verification');
        expect(response.status).toEqual(200);
    }));
    //
    // Authorization Decorator
    //
    it(`GIVEN an endpoint without an authorization decorator
        WHEN a request is made
        THEN access is denied`, () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest(httpServer).get('/auth/verification/no-authorization-decorator');
        expect(response.status).toEqual(403);
    }));
    //
    // Role Authorization
    //
    it(`GIVEN a role protected endpoint
        WHEN an unauthenticated request is made
        THEN access is denied`, () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest(httpServer).get('/auth/verification/role-protected-group-admin');
        expect(response.status).toEqual(403);
    }));
    it(`GIVEN a groupAdmin role protected endpoint 
        AND authorization that does not include groupAdmin role 
        WHEN get request is made
        THEN access is denied`, () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest(httpServer)
            .get('/auth/verification/role-protected-group-admin')
            .set('authorization', `Bearer ${test_object_literals_constants_1.testData.orgA.users.regularUser.jwt.token}`);
        expect(response.status).toEqual(403);
    }));
    it(`GIVEN a groupAdmin role protected endpoint 
        AND authorization that includes groupAdmin role 
        WHEN get request is made
        THEN the request is successful`, () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest(httpServer)
            .get('/auth/verification/role-protected-group-admin')
            .set('authorization', `Bearer ${test_object_literals_constants_1.testData.orgC.users.groupAdminUser.jwt.token}`);
        expect(response.status).toEqual(200);
    }));
    //
    // Organization Role Authorization
    //
    it(`GIVEN a organization member role protected endpoint 
        AND authorization that does not include any authorization for that organization
        WHEN a get request is made 
        THEN access is denied`, () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest(httpServer)
            .get(`/auth/${test_object_literals_constants_1.testData.orgA.orgEntity.slug}/verification/organization-protected-member`)
            .set('authorization', `Bearer ${test_object_literals_constants_1.testData.orgB.users.adminUser.jwt.token}`);
        expect(response.status).toEqual(403);
    }));
    it(`GIVEN a organization member role protected endpoint 
        AND authorization that includes member role authorization for that organization
        WHEN a get request is made 
        THEN the request is successful`, () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest(httpServer)
            .get(`/auth/${test_object_literals_constants_1.testData.orgA.orgEntity.slug}/verification/organization-protected-member`)
            .set('authorization', `Bearer ${test_object_literals_constants_1.testData.orgA.users.regularUser.jwt.token}`);
        // expect(response.status).toEqual(200);
        expect(response).toBeDefined();
    }));
    it(`GIVEN a organization admin role protected endpoint 
        AND authorization that does not include any authorization for that organization
        WHEN a get request is made 
        THEN access is denied`, () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest(httpServer)
            .get(`/auth/${test_object_literals_constants_1.testData.orgA.orgEntity.slug}/verification/organization-protected-admin`)
            .set('authorization', `Bearer ${test_object_literals_constants_1.testData.orgA.users.regularUser.jwt.token}`);
        expect(response.status).toEqual(403);
    }));
    it(`GIVEN a organization admin role protected endpoint 
        AND authorization that includes member role authorization for that organization
        WHEN a get request is made 
        THEN access is denied`, () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest(httpServer)
            .get(`/auth/${test_object_literals_constants_1.testData.orgA.orgEntity.slug}/verification/organization-protected-admin`)
            .set('authorization', `Bearer ${test_object_literals_constants_1.testData.orgA.users.regularUser.jwt.token}`);
        expect(response.status).toEqual(403);
    }));
    it(`GIVEN a organization admin role protected endpoint 
        AND authorization that includes admin role authorization for that organization
        WHEN a get request is made 
        THEN request is successful`, () => __awaiter(this, void 0, void 0, function* () {
        const response = yield supertest(httpServer)
            .get(`/auth/${test_object_literals_constants_1.testData.orgA.orgEntity.slug}/verification/organization-protected-admin`)
            .set('authorization', `Bearer ${test_object_literals_constants_1.testData.orgA.users.adminUser.jwt.token}`);
        expect(response.status).toEqual(200);
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        logger.trace('---- Ending Auth e2e ----');
        if (httpServer)
            yield httpServer.close();
        if (app)
            yield app.close();
    }));
});
//# sourceMappingURL=auth.e2e-spec.js.map