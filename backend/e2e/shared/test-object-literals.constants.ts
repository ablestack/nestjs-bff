import { generateHashedPassword } from '@nestjs-bff/backend/lib/domain/authentication/utils/encryption.util';
import { JwtTokenService } from '@nestjs-bff/backend/lib/host/http/core/jwt/jwt-token.service';
import { TestingUtils } from '@nestjs-bff/backend/lib/shared/utils/testing.utils';
import { OrganizationRoles, Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AppConfig } from '../../dist/config/app.config';

const jwtTokenService = new JwtTokenService(AppConfig);

const testData = {
  orgA: {
    orgEntity: {
      _id: TestingUtils.generateMongoObjectIdString(),
      name: 'Org A',
      slug: 'admin@domain.com',
    },
    users: {
      adminUser: {
        userEntity: {
          _id: TestingUtils.generateMongoObjectIdString(),
          username: 'admin@domain.com',
          displayName: 'first-name last-name',
        },
        authenticationEntity: {
          get userId() {
            return testData.orgA.users.adminUser.userEntity._id;
          },
          local: {
            get email() {
              return testData.orgA.users.adminUser.userEntity.username;
            },
            get hashedPassword() {
              return generateHashedPassword(testData.orgA.users.adminUser.password);
            },
          },
          google: undefined,
          facebook: undefined,
          twitter: undefined,
        },
        accessPermissionsEntity: {
          _id: TestingUtils.generateMongoObjectIdString(),
          get userId() {
            return testData.orgA.users.adminUser.userEntity._id;
          },
          roles: [Roles.user],
          organizations: [
            {
              primary: true,
              get orgId() {
                return testData.orgA.orgEntity._id;
              },
              organizationRoles: [OrganizationRoles.admin],
            },
          ],
        },
        password: 'pa55word',
        jwt: { token: '' },
      },
      regularUser: {
        userEntity: {
          _id: TestingUtils.generateMongoObjectIdString(),
          username: 'user@domain.com',
          displayName: 'first-name last-name',
        },
        authenticationEntity: {
          get userId() {
            return testData.orgA.users.regularUser.userEntity._id;
          },
          local: {
            email: () => testData.orgA.users.regularUser.userEntity.username,
            hashedPassword: () => generateHashedPassword(testData.orgA.users.regularUser.password),
          },
          google: undefined,
          facebook: undefined,
          twitter: undefined,
        },
        accessPermissionsEntity: {
          _id: TestingUtils.generateMongoObjectIdString(),
          get userId() {
            return testData.orgA.users.regularUser.userEntity._id;
          },
          roles: [Roles.user],
          organizations: [
            {
              primary: true,
              get orgId() { return testData.orgA.orgEntity._id;},
              organizationRoles: [OrganizationRoles.member],
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
      _id: TestingUtils.generateMongoObjectIdString(),
      name: 'Org B',
      slug: 'admin@domain-b.com',
    },
    users: {
      adminUser: {
        userEntity: {
          _id: TestingUtils.generateMongoObjectIdString(),
          username: 'admin@domain-b.com',
          displayName: 'regular user',
        },
        authenticationEntity: {
          get userId() {
            return testData.orgB.users.adminUser.userEntity._id;
          },
          local: {
            email: () => testData.orgB.users.adminUser.userEntity.username,
            hashedPassword: () => generateHashedPassword(testData.orgB.users.adminUser.password),
          },
          google: undefined,
          facebook: undefined,
          twitter: undefined,
        },
        accessPermissionsEntity: {
          _id: TestingUtils.generateMongoObjectIdString(),
          get userId() {
            return testData.orgB.users.adminUser.userEntity._id;
          },
          roles: [Roles.user],
          organizations: [
            {
              primary: true,
              get orgId() { return testData.orgB.orgEntity._id;},
              organizationRoles: [OrganizationRoles.admin],
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
      _id: TestingUtils.generateMongoObjectIdString(),
      name: 'Org C',
      slug: 'group-admin@group-admin-domain.com',
    },
    users: {
      groupAdminUser: {
        userEntity: {
          _id: TestingUtils.generateMongoObjectIdString(),
          username: 'group-admin@group-admin-domain.com',
          displayName: 'first-name last-name',
        },
        authenticationEntity: {
          get userId() {
            return testData.orgC.users.adminUser.userEntity._id;
          },
          local: {
            email: () => testData.orgC.users.adminUser.userEntity.username,
            hashedPassword: () => generateHashedPassword(testData.orgC.users.adminUser.password),
          },
          google: undefined,
          facebook: undefined,
          twitter: undefined,
        },
        accessPermissionsEntity: {
          _id: TestingUtils.generateMongoObjectIdString(),
          get userId() {
            return testData.orgC.users.groupAdminUser.userEntity._id;
          },
          roles: [Roles.groupAdmin],
          organizations: [
            {
              primary: true,
              get orgId() { return testData.orgC.orgEntity._id;},
              organizationRoles: [OrganizationRoles.admin],
            },
            ,
            {
              primary: true,
              get orgId() { return testData.orgA.orgEntity._id;},
              organizationRoles: [OrganizationRoles.facilitator],
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
      _id: TestingUtils.generateMongoObjectIdString(),
      name: 'Org Z',
      slug: 'sys-admin@sys-admin-domain.com',
    },
    users: {
      systemAdminUser: {
        userEntity: {
          _id: TestingUtils.generateMongoObjectIdString(),
          username: 'sys-admin@sys-admin-domain.com',
          displayName: 'first-name last-name',
        },
        accessPermissionsEntity: {
          _id: TestingUtils.generateMongoObjectIdString(),
          get userId() {
            return testData.orgZ.users.systemAdminUser.userEntity._id;
          },
          roles: [Roles.systemAdmin],
          organizations: [
            {
              primary: true,
              get orgId() { return testData.orgZ.orgEntity._id;},
              organizationRoles: [OrganizationRoles.admin],
            },
          ],
        },
      },
    },
  },
};

testData.orgA.users.adminUser.jwt.token = jwtTokenService.createToken(
  testData.orgA.users.adminUser.accessPermissionsEntity,
);

testData.orgA.users.regularUser.jwt.token = jwtTokenService.createToken(
  testData.orgA.users.regularUser.accessPermissionsEntity,
);

testData.orgB.users.adminUser.jwt.token = jwtTokenService.createToken(
  testData.orgB.users.adminUser.accessPermissionsEntity,
);

testData.orgC.users.groupAdminUser.jwt.token = jwtTokenService.createToken(
  testData.orgC.users.groupAdminUser.accessPermissionsEntity,
);

testData.orgA.users.systemAdminUser.jwt.token = jwtTokenService.createToken(
  testData.orgA.users.systemAdminUser.accessPermissionsEntity,
);

export { testData };
