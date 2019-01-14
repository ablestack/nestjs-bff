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
      },
      regularUser: {
        userEntity: {
          _id: TestingUtils.generateMongoObjectIdString(),
          username: 'user@domain.com',
          displayName: 'first-name last-name',
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
        password: 'pa55word',
      },
    },
  },
};
