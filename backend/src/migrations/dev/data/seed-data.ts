import { ObjectId } from 'mongodb';

export const data = {
  users: [
    {
      _id: new ObjectId('5be02a02be151604dc7e8b68'),
      username: 'admin@domain.com',
      displayName: 'first-name last-name',
      createdAt: new Date('2018-11-05T11:31:14.823+0000'),
      updatedAt: new Date('2018-11-05T11:31:14.823+0000'),
      __v: 0,
    },
    {
      _id: new ObjectId('5be02a02be151604dc7e8b6d'),
      username: 'user@domain.com',
      displayName: 'first-name last-name',
      createdAt: new Date('2018-11-05T11:31:14.916+0000'),
      updatedAt: new Date('2018-11-05T11:31:14.916+0000'),
      __v: 0,
    },
    {
      _id: new ObjectId('5be02a03be151604dc7e8b71'),
      username: 'admin@domain-b.com',
      displayName: 'regular user',
      createdAt: new Date('2018-11-05T11:31:15.002+0000'),
      updatedAt: new Date('2018-11-05T11:31:15.002+0000'),
      __v: 0,
    },
    {
      _id: new ObjectId('5be02a03be151604dc7e8b76'),
      username: 'group-admin@group-admin-domain.com',
      displayName: 'first-name last-name',
      createdAt: new Date('2018-11-05T11:31:15.057+0000'),
      updatedAt: new Date('2018-11-05T11:31:15.057+0000'),
      __v: 0,
    },
  ],
  authentications: [
    {
      _id: new ObjectId('5be02a02be151604dc7e8b69'),
      local: {
        email: 'admin@domain.com',
        hashedPassword: '$2a$08$q9rfQYDBcIghPXMT3oeLIeCbB5l5SNbUnynDsKhqrCjWEEbrlQDfW',
      },
      userId: new ObjectId('5be02a02be151604dc7e8b68'),
      createdAt: new Date('2018-11-05T11:31:14.834+0000'),
      updatedAt: new Date('2018-11-05T11:31:14.834+0000'),
      __v: 0,
    },
    {
      _id: new ObjectId('5be02a02be151604dc7e8b6e'),
      local: {
        email: 'user@domain.com',
        hashedPassword: '$2a$08$PlLJMrM/LtfoW8JdCyT3zemEybdaHLh/ErimQffxoE4LiLDw0CUkq',
      },
      userId: new ObjectId('5be02a02be151604dc7e8b6d'),
      createdAt: new Date('2018-11-05T11:31:14.920+0000'),
      updatedAt: new Date('2018-11-05T11:31:14.920+0000'),
      __v: 0,
    },
    {
      _id: new ObjectId('5be02a03be151604dc7e8b72'),
      local: {
        email: 'admin@domain-b.com',
        hashedPassword: '$2a$08$6Xzzgp6JxWjxe5HXl/a4VOtZvFDTmtZ2dSUPrYMzOnvl1N0I05k9y',
      },
      userId: new ObjectId('5be02a03be151604dc7e8b71'),
      createdAt: new Date('2018-11-05T11:31:15.005+0000'),
      updatedAt: new Date('2018-11-05T11:31:15.005+0000'),
      __v: 0,
    },
    {
      _id: new ObjectId('5be02a03be151604dc7e8b77'),
      local: {
        email: 'group-admin@group-admin-domain.com',
        hashedPassword: '$2a$08$7CxALbFD/RewHkDxVmkXb.ejT.x.The5BAMi9OVv/Wzyfp3IUTYsC',
      },
      userId: new ObjectId('5be02a03be151604dc7e8b76'),
      createdAt: new Date('2018-11-05T11:31:15.060+0000'),
      updatedAt: new Date('2018-11-05T11:31:15.060+0000'),
      __v: 0,
    },
  ],
  organizations: [
    {
      _id: new ObjectId('5be02a02be151604dc7e8b6a'),
      name: 'admin@domain.com',
      slug: 'admin@domain.com',
      createdAt: new Date('2018-11-05T11:31:14.834+0000'),
      updatedAt: new Date('2018-11-05T11:31:14.834+0000'),
      __v: 0,
    },
    {
      _id: new ObjectId('5be02a03be151604dc7e8b73'),
      name: 'admin@domain-b.com',
      slug: 'admin@domain-b.com',
      createdAt: new Date('2018-11-05T11:31:15.005+0000'),
      updatedAt: new Date('2018-11-05T11:31:15.005+0000'),
      __v: 0,
    },
    {
      _id: new ObjectId('5be02a03be151604dc7e8b78'),
      name: 'group-admin@group-admin-domain.com',
      slug: 'group-admin@group-admin-domain.com',
      createdAt: new Date('2018-11-05T11:31:15.060+0000'),
      updatedAt: new Date('2018-11-05T11:31:15.060+0000'),
      __v: 0,
    },
  ],
  authorizations: [
    {
      _id: new ObjectId('5be02a02be151604dc7e8b6b'),
      roles: ['user'],
      organizations: [
        {
          organizationRoles: ['member', 'admin'],
          _id: new ObjectId('5be02a02be151604dc7e8b6c'),
          primary: true,
          orgId: new ObjectId('5be02a02be151604dc7e8b6a'),
        },
      ],
      userId: new ObjectId('5be02a02be151604dc7e8b68'),
      createdAt: new Date('2018-11-05T11:31:14.849+0000'),
      updatedAt: new Date('2018-11-05T11:31:14.849+0000'),
      __v: 0,
    },
    {
      _id: new ObjectId('5be02a02be151604dc7e8b6f'),
      roles: ['user'],
      organizations: [
        {
          organizationRoles: ['member'],
          _id: new ObjectId('5be02a02be151604dc7e8b70'),
          primary: true,
          orgId: new ObjectId('5be02a02be151604dc7e8b6a'),
        },
      ],
      userId: new ObjectId('5be02a02be151604dc7e8b6d'),
      createdAt: new Date('2018-11-05T11:31:14.920+0000'),
      updatedAt: new Date('2018-11-05T11:31:14.920+0000'),
      __v: 0,
    },
    {
      _id: new ObjectId('5be02a03be151604dc7e8b74'),
      roles: ['user'],
      organizations: [
        {
          organizationRoles: ['member', 'admin'],
          _id: new ObjectId('5be02a03be151604dc7e8b75'),
          primary: true,
          orgId: new ObjectId('5be02a03be151604dc7e8b73'),
        },
      ],
      userId: new ObjectId('5be02a03be151604dc7e8b71'),
      createdAt: new Date('2018-11-05T11:31:15.009+0000'),
      updatedAt: new Date('2018-11-05T11:31:15.009+0000'),
      __v: 0,
    },
    {
      _id: new ObjectId('5be02a03be151604dc7e8b79'),
      roles: ['user', 'groupAdmin'],
      organizations: [
        {
          organizationRoles: ['member', 'admin'],
          _id: new ObjectId('5be02a03be151604dc7e8b7a'),
          primary: true,
          orgId: new ObjectId('5be02a03be151604dc7e8b78'),
        },
      ],
      userId: new ObjectId('5be02a03be151604dc7e8b76'),
      createdAt: new Date('2018-11-05T11:31:15.063+0000'),
      updatedAt: new Date('2018-11-05T11:31:15.075+0000'),
      __v: 0,
    },
  ],
};
