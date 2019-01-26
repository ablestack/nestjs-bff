import { OrganizationRoles, Roles } from '@nestjs-bff/global-contracts/lib/shared/authorization/roles.constants';
import { generateHashedPassword } from '../../src/domain/authentication/utils/encryption.util';

export const testData = {
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
              return generateHashedPassword(testData.orgA.users.adminUser.password);
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
          roles: [Roles.user],
          organizations: [
            {
              primary: true,
              get orgId() {
                return testData.orgA.orgEntity.id;
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
            hashedPassword: () => generateHashedPassword(testData.orgA.users.regularUser.password),
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
          roles: [Roles.user],
          organizations: [
            {
              primary: true,
              get orgId() {
                return testData.orgA.orgEntity.id;
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
            hashedPassword: () => generateHashedPassword(testData.orgB.users.adminUser.password),
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
          roles: [Roles.user],
          organizations: [
            {
              primary: true,
              get orgId() {
                return testData.orgB.orgEntity.id;
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
            hashedPassword: () => generateHashedPassword(testData.orgC.users.groupAdminUser.password),
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
          roles: [Roles.groupAdmin],
          organizations: [
            {
              primary: true,
              get orgId() {
                return testData.orgC.orgEntity.id;
              },
              organizationRoles: [OrganizationRoles.admin],
            },
            {
              primary: false,
              get orgId() {
                return testData.orgA.orgEntity.id;
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
          roles: [Roles.systemAdmin],
          organizations: [
            {
              primary: true,
              get orgId() {
                return testData.orgZ.orgEntity.id;
              },
              organizationRoles: [OrganizationRoles.admin],
            },
          ],
        },
      },
    },
  },
};
