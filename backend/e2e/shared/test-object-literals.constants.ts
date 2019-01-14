import { generateHashedPassword } from '@nestjs-bff/backend/lib/domain/authentication/utils/encryption.util';
import { TestingUtils } from '@nestjs-bff/backend/lib/shared/utils/testing.utils';
import { OrganizationRoles, Roles } from '@nestjs-bff/global/lib/constants/roles.constants';

export const testData = {
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
          userId: () => testData.orgA.users.adminUser.userEntity._id,
          local: {
            email: () => testData.orgA.users.adminUser.userEntity.username,
            hashedPassword: () => generateHashedPassword(testData.orgA.users.adminUser.password),
          },
          google: undefined,
          facebook: undefined,
          twitter: undefined,
        },
        accessPermissionsEntity: {
          _id: TestingUtils.generateMongoObjectIdString(),
          userId: () => testData.orgA.users.adminUser.userEntity._id,
          roles: [Roles.user],
          organizations: [
            {
              primary: true,
              orgId: () => testData.orgA.orgEntity._id,
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
          userId: () => testData.orgA.users.regularUser.userEntity._id,
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
          userId: () => testData.orgA.users.regularUser.userEntity._id,
          roles: [Roles.user],
          organizations: [
            {
              primary: true,
              orgId: () => testData.orgA.orgEntity._id,
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
          userId: () => testData.orgB.users.adminUser.userEntity._id,
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
          userId: () => testData.orgB.users.adminUser.userEntity._id,
          roles: [Roles.user],
          organizations: [
            {
              primary: true,
              orgId: () => testData.orgB.orgEntity._id,
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
          userId: () => testData.orgC.users.adminUser.userEntity._id,
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
          userId: () => testData.orgC.users.groupAdminUser.userEntity._id,
          roles: [Roles.groupAdmin],
          organizations: [
            {
              primary: true,
              orgId: () => testData.orgC.orgEntity._id,
              organizationRoles: [OrganizationRoles.admin],
            },
            ,
            {
              primary: true,
              orgId: () => testData.orgA.orgEntity._id,
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
          userId: () => testData.orgZ.users.systemAdminUser.userEntity._id,
          roles: [Roles.systemAdmin],
          organizations: [
            {
              primary: true,
              orgId: () => testData.orgZ.orgEntity._id,
              organizationRoles: [OrganizationRoles.admin],
            },
          ],
        },
      },
    },
  },
};
