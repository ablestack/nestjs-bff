import { ObjectId } from 'mongodb';

export const data = {
  users: [
    {
      _id: ObjectId('a00000000000000000000001'),
      username: 'admin@domain.com',
      displayName: 'first-name last-name',
      createdAt: new Date('2019-01-22T03:39:22.756+0000'),
      updatedAt: new Date('2019-01-22T03:39:22.756+0000'),
      __v: 0,
    },
    {
      _id: ObjectId('a00000000000000000000002'),
      username: 'user@domain.com',
      displayName: 'first-name last-name',
      createdAt: new Date('2019-01-22T03:39:23.149+0000'),
      updatedAt: new Date('2019-01-22T03:39:23.149+0000'),
      __v: 0,
    },
    {
      _id: ObjectId('b00000000000000000000001'),
      username: 'admin@domain-b.com',
      displayName: 'regular user',
      createdAt: new Date('2019-01-22T03:39:23.234+0000'),
      updatedAt: new Date('2019-01-22T03:39:23.234+0000'),
      __v: 0,
    },
    {
      _id: ObjectId('c00000000000000000000001'),
      username: 'group-admin@group-admin-domain.com',
      displayName: 'first-name last-name',
      createdAt: new Date('2019-01-22T03:39:23.306+0000'),
      updatedAt: new Date('2019-01-22T03:39:23.306+0000'),
      __v: 0,
    },
    {
      _id: ObjectId('f00000000000000000000001'),
      username: 'sys-admin@sys-admin-domain.com',
      displayName: 'first-name last-name',
      createdAt: new Date('2019-01-22T03:39:23.391+0000'),
      updatedAt: new Date('2019-01-22T03:39:23.391+0000'),
      __v: 0,
    },
  ],
  authentications: [
    {
      _id: ObjectId('5c46906ac07baa98e0ce4a32'),
      local: {
        email: 'admin@domain.com',
        hashedPassword: '$2a$08$fkDiwuscJSWmDqEYo86xpejj7hVPGUkVeOMdRQC/dJhXFSjqPPqky',
      },
      userId: ObjectId('a00000000000000000000001'),
      createdAt: new Date('2019-01-22T03:39:22.958+0000'),
      updatedAt: new Date('2019-01-22T03:39:22.958+0000'),
      __v: 0,
    },
    {
      _id: ObjectId('5c46906bc07baa98e0ce4a36'),
      local: {
        email: '() => testdata.orga.users.regularuser.userentity.username',
        hashedPassword: '() => encryption_util_1.generateHashedPassword(testData.orgA.users.regularUser.password)',
      },
      userId: ObjectId('a00000000000000000000002'),
      createdAt: new Date('2019-01-22T03:39:23.167+0000'),
      updatedAt: new Date('2019-01-22T03:39:23.167+0000'),
      __v: 0,
    },
    {
      _id: ObjectId('5c46906bc07baa98e0ce4a3b'),
      local: {
        email: '() => testdata.orgb.users.adminuser.userentity.username',
        hashedPassword: '() => encryption_util_1.generateHashedPassword(testData.orgB.users.adminUser.password)',
      },
      userId: ObjectId('b00000000000000000000001'),
      createdAt: new Date('2019-01-22T03:39:23.251+0000'),
      updatedAt: new Date('2019-01-22T03:39:23.251+0000'),
      __v: 0,
    },
    {
      _id: ObjectId('5c46906bc07baa98e0ce4a40'),
      local: {
        email: '() => testdata.orgc.users.groupadminuser.userentity.username',
        hashedPassword: '() => encryption_util_1.generateHashedPassword(testData.orgC.users.groupAdminUser.password)',
      },
      userId: ObjectId('c00000000000000000000001'),
      createdAt: new Date('2019-01-22T03:39:23.325+0000'),
      updatedAt: new Date('2019-01-22T03:39:23.325+0000'),
      __v: 0,
    },
  ],
  organizations: [
    {
      _id: ObjectId('a00000000000000000000000'),
      name: 'Org A',
      slug: 'admin@domain.com',
      createdAt: new Date('2019-01-22T03:39:22.663+0000'),
      updatedAt: new Date('2019-01-22T03:39:22.663+0000'),
      __v: 0,
    },
    {
      _id: ObjectId('b00000000000000000000000'),
      name: 'Org B',
      slug: 'admin@domain-b.com',
      createdAt: new Date('2019-01-22T03:39:23.215+0000'),
      updatedAt: new Date('2019-01-22T03:39:23.215+0000'),
      __v: 0,
    },
    {
      _id: ObjectId('c00000000000000000000000'),
      name: 'Org C',
      slug: 'group-admin@group-admin-domain.com',
      createdAt: new Date('2019-01-22T03:39:23.292+0000'),
      updatedAt: new Date('2019-01-22T03:39:23.292+0000'),
      __v: 0,
    },
    {
      _id: ObjectId('f00000000000000000000000'),
      name: 'Org Z',
      slug: 'sys-admin@sys-admin-domain.com',
      createdAt: new Date('2019-01-22T03:39:23.373+0000'),
      updatedAt: new Date('2019-01-22T03:39:23.373+0000'),
      __v: 0,
    },
  ],
  accesspermissions: [
    {
      _id: ObjectId('a00000000000000000000011'),
      roles: ['user'],
      organizations: [
        {
          organizationRoles: ['admin'],
          _id: ObjectId('5c46906bc07baa98e0ce4a34'),
          primary: true,
          orgId: ObjectId('a00000000000000000000000'),
        },
      ],
      userId: ObjectId('a00000000000000000000001'),
      createdAt: new Date('2019-01-22T03:39:23.058+0000'),
      updatedAt: new Date('2019-01-22T03:39:23.058+0000'),
      __v: 0,
    },
    {
      _id: ObjectId('a00000000000000000000022'),
      roles: ['user'],
      organizations: [
        {
          organizationRoles: ['member'],
          _id: ObjectId('5c46906bc07baa98e0ce4a38'),
          primary: true,
          orgId: ObjectId('a00000000000000000000000'),
        },
      ],
      userId: ObjectId('a00000000000000000000002'),
      createdAt: new Date('2019-01-22T03:39:23.195+0000'),
      updatedAt: new Date('2019-01-22T03:39:23.195+0000'),
      __v: 0,
    },
    {
      _id: ObjectId('b00000000000000000000011'),
      roles: ['user'],
      organizations: [
        {
          organizationRoles: ['admin'],
          _id: ObjectId('5c46906bc07baa98e0ce4a3d'),
          primary: true,
          orgId: ObjectId('b00000000000000000000000'),
        },
      ],
      userId: ObjectId('b00000000000000000000001'),
      createdAt: new Date('2019-01-22T03:39:23.274+0000'),
      updatedAt: new Date('2019-01-22T03:39:23.274+0000'),
      __v: 0,
    },
    {
      _id: ObjectId('c00000000000000000000011'),
      roles: ['groupAdmin'],
      organizations: [
        {
          organizationRoles: ['admin'],
          _id: ObjectId('5c46906bc07baa98e0ce4a43'),
          primary: true,
          orgId: ObjectId('c00000000000000000000000'),
        },
        {
          organizationRoles: ['facilitator'],
          _id: ObjectId('5c46906bc07baa98e0ce4a42'),
          primary: false,
          orgId: ObjectId('a00000000000000000000000'),
        },
      ],
      userId: ObjectId('c00000000000000000000001'),
      createdAt: new Date('2019-01-22T03:39:23.354+0000'),
      updatedAt: new Date('2019-01-22T03:39:23.354+0000'),
      __v: 0,
    },
    {
      _id: ObjectId('f00000000000000000000011'),
      roles: ['systemAdmin'],
      organizations: [
        {
          organizationRoles: ['admin'],
          _id: ObjectId('5c46906bc07baa98e0ce4a47'),
          primary: true,
          orgId: ObjectId('f00000000000000000000000'),
        },
      ],
      userId: ObjectId('f00000000000000000000001'),
      createdAt: new Date('2019-01-22T03:39:23.412+0000'),
      updatedAt: new Date('2019-01-22T03:39:23.412+0000'),
      __v: 0,
    },
  ],
};
