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
const roles_constants_1 = require("@nestjs-bff/global/lib/constants/roles.constants");
const encryption_util_1 = require("../../src/domain/authentication/utils/encryption.util");
const jwt_token_service_1 = require("../../src/host/http/core/jwt/jwt-token.service");
const testData = {
    orgA: {
        orgEntity: {
            _id: 'a00000000000000000000000',
            get id() {
                return this._id;
            },
            name: 'Org A',
            slug: 'admin@domain.com',
        },
        users: {
            adminUser: {
                userEntity: {
                    _id: 'a00000000000000000000001',
                    get id() {
                        return this._id;
                    },
                    username: 'admin@domain.com',
                    displayName: 'first-name last-name',
                },
                authenticationEntity: {
                    get userId() {
                        return testData.orgA.users.adminUser.userEntity.id;
                    },
                    local: {
                        get email() {
                            return testData.orgA.users.adminUser.userEntity.username;
                        },
                        get hashedPassword() {
                            return encryption_util_1.generateHashedPassword(testData.orgA.users.adminUser.password);
                        },
                    },
                    google: undefined,
                    facebook: undefined,
                    twitter: undefined,
                },
                accessPermissionsEntity: {
                    _id: 'a00000000000000000000011',
                    get id() {
                        return this._id;
                    },
                    get userId() {
                        return testData.orgA.users.adminUser.userEntity.id;
                    },
                    roles: [roles_constants_1.Roles.user],
                    organizations: [
                        {
                            primary: true,
                            get orgId() {
                                return testData.orgA.orgEntity.id;
                            },
                            organizationRoles: [roles_constants_1.OrganizationRoles.admin],
                        },
                    ],
                },
                password: 'pa55word',
                jwt: { token: '' },
            },
            regularUser: {
                userEntity: {
                    _id: 'a00000000000000000000002',
                    get id() {
                        return this._id;
                    },
                    username: 'user@domain.com',
                    displayName: 'first-name last-name',
                },
                authenticationEntity: {
                    get userId() {
                        return testData.orgA.users.regularUser.userEntity.id;
                    },
                    local: {
                        email: () => testData.orgA.users.regularUser.userEntity.username,
                        hashedPassword: () => encryption_util_1.generateHashedPassword(testData.orgA.users.regularUser.password),
                    },
                    google: undefined,
                    facebook: undefined,
                    twitter: undefined,
                },
                accessPermissionsEntity: {
                    _id: 'a00000000000000000000022',
                    get id() {
                        return this._id;
                    },
                    get userId() {
                        return testData.orgA.users.regularUser.userEntity.id;
                    },
                    roles: [roles_constants_1.Roles.user],
                    organizations: [
                        {
                            primary: true,
                            get orgId() {
                                return testData.orgA.orgEntity.id;
                            },
                            organizationRoles: [roles_constants_1.OrganizationRoles.member],
                        },
                    ],
                },
                password: 'pa55word',
                jwt: { token: '' },
            },
        },
    },
    orgB: {
        orgEntity: {
            _id: 'b00000000000000000000000',
            get id() {
                return this._id;
            },
            name: 'Org B',
            slug: 'admin@domain-b.com',
        },
        users: {
            adminUser: {
                userEntity: {
                    _id: 'b00000000000000000000001',
                    get id() {
                        return this._id;
                    },
                    username: 'admin@domain-b.com',
                    displayName: 'regular user',
                },
                authenticationEntity: {
                    get userId() {
                        return testData.orgB.users.adminUser.userEntity.id;
                    },
                    local: {
                        email: () => testData.orgB.users.adminUser.userEntity.username,
                        hashedPassword: () => encryption_util_1.generateHashedPassword(testData.orgB.users.adminUser.password),
                    },
                    google: undefined,
                    facebook: undefined,
                    twitter: undefined,
                },
                accessPermissionsEntity: {
                    _id: 'b00000000000000000000011',
                    get id() {
                        return this._id;
                    },
                    get userId() {
                        return testData.orgB.users.adminUser.userEntity.id;
                    },
                    roles: [roles_constants_1.Roles.user],
                    organizations: [
                        {
                            primary: true,
                            get orgId() {
                                return testData.orgB.orgEntity.id;
                            },
                            organizationRoles: [roles_constants_1.OrganizationRoles.admin],
                        },
                    ],
                },
                password: 'pa55word',
                jwt: { token: '' },
            },
        },
    },
    orgC: {
        orgEntity: {
            _id: 'c00000000000000000000000',
            get id() {
                return this._id;
            },
            name: 'Org C',
            slug: 'group-admin@group-admin-domain.com',
        },
        users: {
            groupAdminUser: {
                userEntity: {
                    _id: 'c00000000000000000000001',
                    get id() {
                        return this._id;
                    },
                    username: 'group-admin@group-admin-domain.com',
                    displayName: 'first-name last-name',
                },
                authenticationEntity: {
                    get userId() {
                        return testData.orgC.users.groupAdminUser.userEntity.id;
                    },
                    local: {
                        email: () => testData.orgC.users.groupAdminUser.userEntity.username,
                        hashedPassword: () => encryption_util_1.generateHashedPassword(testData.orgC.users.groupAdminUser.password),
                    },
                    google: undefined,
                    facebook: undefined,
                    twitter: undefined,
                },
                accessPermissionsEntity: {
                    _id: 'c00000000000000000000011',
                    get id() {
                        return this._id;
                    },
                    get userId() {
                        return testData.orgC.users.groupAdminUser.userEntity.id;
                    },
                    roles: [roles_constants_1.Roles.groupAdmin],
                    organizations: [
                        {
                            primary: true,
                            get orgId() {
                                return testData.orgC.orgEntity.id;
                            },
                            organizationRoles: [roles_constants_1.OrganizationRoles.admin],
                        },
                        {
                            primary: false,
                            get orgId() {
                                return testData.orgA.orgEntity.id;
                            },
                            organizationRoles: [roles_constants_1.OrganizationRoles.facilitator],
                        },
                    ],
                },
                password: 'pa55word',
                jwt: { token: '' },
            },
        },
    },
    orgZ: {
        orgEntity: {
            _id: 'f00000000000000000000000',
            get id() {
                return this._id;
            },
            name: 'Org Z',
            slug: 'sys-admin@sys-admin-domain.com',
        },
        users: {
            systemAdminUser: {
                userEntity: {
                    _id: 'f00000000000000000000001',
                    get id() {
                        return this._id;
                    },
                    username: 'sys-admin@sys-admin-domain.com',
                    displayName: 'first-name last-name',
                },
                accessPermissionsEntity: {
                    _id: 'f00000000000000000000011',
                    get id() {
                        return this._id;
                    },
                    get userId() {
                        return testData.orgZ.users.systemAdminUser.userEntity.id;
                    },
                    roles: [roles_constants_1.Roles.systemAdmin],
                    organizations: [
                        {
                            primary: true,
                            get orgId() {
                                return testData.orgZ.orgEntity.id;
                            },
                            organizationRoles: [roles_constants_1.OrganizationRoles.admin],
                        },
                    ],
                },
            },
        },
    },
};
exports.testData = testData;
exports.setupTestDataJwtTokens = (nestJsBffConfig) => __awaiter(this, void 0, void 0, function* () {
    const jwtTokenService = new jwt_token_service_1.JwtTokenService(nestJsBffConfig);
    testData.orgA.users.adminUser.jwt = yield jwtTokenService.createToken(testData.orgA.users.adminUser.accessPermissionsEntity);
    testData.orgA.users.regularUser.jwt = yield jwtTokenService.createToken(testData.orgA.users.regularUser.accessPermissionsEntity);
    testData.orgB.users.adminUser.jwt = yield jwtTokenService.createToken(testData.orgB.users.adminUser.accessPermissionsEntity);
    testData.orgC.users.groupAdminUser.jwt = yield jwtTokenService.createToken(testData.orgC.users.groupAdminUser.accessPermissionsEntity);
});
//# sourceMappingURL=test-object-literals.constants.js.map