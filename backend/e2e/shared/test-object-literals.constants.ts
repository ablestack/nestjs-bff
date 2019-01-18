import { generateHashedPassword } from '@nestjs-bff/backend/lib/domain/authentication/utils/encryption.util';
import { JwtTokenService } from '@nestjs-bff/backend/lib/host/http/core/jwt/jwt-token.service';
import { OrganizationRoles, Roles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { AppConfig } from '../../dist/config/app.config';

const jwtTokenService = new JwtTokenService(AppConfig);

const testData = {
  orgA: {
    orgEntity: {
      _id: 'a00000000000000000000000',
      name: 'Org A',
      slug: 'admin@domain.com',
    },
    users: {
      adminUser: {
        userEntity: {
          _id: 'a00000000000000000000001',
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
          _id: 'a00000000000000000000011',
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
          _id: 'a00000000000000000000002',
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
          _id: 'a00000000000000000000022',
          get userId() {
            return testData.orgA.users.regularUser.userEntity._id;
          },
          roles: [Roles.user],
          organizations: [
            {
              primary: true,
              get orgId() {
                return testData.orgA.orgEntity._id;
              },
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
      _id: 'b00000000000000000000000',
      name: 'Org B',
      slug: 'admin@domain-b.com',
    },
    users: {
      adminUser: {
        userEntity: {
          _id: 'b00000000000000000000001',
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
          _id: 'b00000000000000000000011',
          get userId() {
            return testData.orgB.users.adminUser.userEntity._id;
          },
          roles: [Roles.user],
          organizations: [
            {
              primary: true,
              get orgId() {
                return testData.orgB.orgEntity._id;
              },
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
      _id: 'c00000000000000000000000',
      name: 'Org C',
      slug: 'group-admin@group-admin-domain.com',
    },
    users: {
      groupAdminUser: {
        userEntity: {
          _id: 'c00000000000000000000001',
          username: 'group-admin@group-admin-domain.com',
          displayName: 'first-name last-name',
        },
        authenticationEntity: {
          get userId() {
            return testData.orgC.users.groupAdminUser.userEntity._id;
          },
          local: {
            email: () => testData.orgC.users.groupAdminUser.userEntity.username,
            hashedPassword: () => generateHashedPassword(testData.orgC.users.groupAdminUser.password),
          },
          google: undefined,
          facebook: undefined,
          twitter: undefined,
        },
        accessPermissionsEntity: {
          _id: 'c00000000000000000000011',
          get userId() {
            return testData.orgC.users.groupAdminUser.userEntity._id;
          },
          roles: [Roles.groupAdmin],
          organizations: [
            {
              primary: true,
              get orgId() {
                return testData.orgC.orgEntity._id;
              },
              organizationRoles: [OrganizationRoles.admin],
            },
            {
              primary: false,
              get orgId() {
                return testData.orgA.orgEntity._id;
              },
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
      _id: 'f00000000000000000000000',
      name: 'Org Z',
      slug: 'sys-admin@sys-admin-domain.com',
    },
    users: {
      systemAdminUser: {
        userEntity: {
          _id: 'f00000000000000000000001',
          username: 'sys-admin@sys-admin-domain.com',
          displayName: 'first-name last-name',
        },
        accessPermissionsEntity: {
          _id: 'f00000000000000000000011',
          get userId() {
            return testData.orgZ.users.systemAdminUser.userEntity._id;
          },
          roles: [Roles.systemAdmin],
          organizations: [
            {
              primary: true,
              get orgId() {
                return testData.orgZ.orgEntity._id;
              },
              organizationRoles: [OrganizationRoles.admin],
            },
          ],
        },
      },
    },
  },
};

export const setupTestDataJwtTokens = async () => {
  testData.orgA.users.adminUser.jwt = await jwtTokenService.createToken(
    testData.orgA.users.adminUser.accessPermissionsEntity,
  );

  testData.orgA.users.regularUser.jwt = await jwtTokenService.createToken(
    testData.orgA.users.regularUser.accessPermissionsEntity,
  );

  testData.orgB.users.adminUser.jwt = await jwtTokenService.createToken(
    testData.orgB.users.adminUser.accessPermissionsEntity,
  );

  testData.orgC.users.groupAdminUser.jwt = await jwtTokenService.createToken(
    testData.orgC.users.groupAdminUser.accessPermissionsEntity,
  );
};

export { testData };
