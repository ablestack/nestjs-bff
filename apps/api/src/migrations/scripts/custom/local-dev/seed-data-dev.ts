export const data = {
  users: [
    {
      _id: '5be02a02be151604dc7e8b68',
      username: 'admin@domain-a.com',
      displayName: 'first-name last-name',
    },
    {
      _id: '5be02a02be151604dc7e8b6d',
      username: 'user@domain-a.com',
      displayName: 'first-name last-name',
    },
    {
      _id: '5be02a03be151604dc7e8b71',
      username: 'admin@domain-b.com',
      displayName: 'regular user',
    },
    {
      _id: '5be02a03be151604dc7e8b76',
      username: 'group-admin@group-admin-domain.com',
      displayName: 'first-name last-name',
    },
  ],
  authentications: [
    {
      _id: '5be02a02be151604dc7e8b69',
      local: {
        email: 'admin@domain-a.com',
        hashedPassword: '$2a$08$k/GJ6Y8cQNtb7Q7hwQJf1uHBlAT4Cr1W/En627F0wWAo8UxqlD9HW',
      },
      userId: '5be02a02be151604dc7e8b68',
    },
    {
      _id: '5be02a02be151604dc7e8b6e',
      local: {
        email: 'user@domain-a.com',
        hashedPassword: '$2a$08$5Vo9mm0EiZRVkzHC2JbkrOyzJ1EQ2ipHr1JGzOX43XBQvzl7ourkO',
      },
      userId: '5be02a02be151604dc7e8b6d',
    },
    {
      _id: '5be02a03be151604dc7e8b72',
      local: {
        email: 'admin@domain-b.com',
        hashedPassword: '$2a$08$Q97SVKnfqrlcOAUCKTpSPOL.T/pIVwznRAEVHtAF/4n4tdtRnej56',
      },
      userId: '5be02a03be151604dc7e8b71',
    },
    {
      _id: '5be02a03be151604dc7e8b77',
      local: {
        email: 'group-admin@group-admin-domain.com',
        hashedPassword: '$2a$08$k/tNqd34WZBO21y7p7LZIOPRIU0QTaLiEsu3.76Yayp88PGARfQL6',
      },
      userId: '5be02a03be151604dc7e8b76',
    },
  ],
  organizations: [
    {
      _id: '5be02a02be151604dc7e8b6a',
      name: 'admin@domain-a.com',
      slug: 'admin@domain-a.com',
    },
    {
      _id: '5be02a03be151604dc7e8b73',
      name: 'admin@domain-b.com',
      slug: 'admin@domain-b.com',
    },
    {
      _id: '5be02a03be151604dc7e8b78',
      name: 'group-admin@group-admin-domain.com',
      slug: 'group-admin@group-admin-domain.com',
    },
  ],
  authorizations: [
    {
      _id: '5be02a02be151604dc7e8b6b',
      roles: ['user'],
      organizations: [
        {
          organizationRoles: ['member', 'admin'],
          _id: '5be02a02be151604dc7e8b6c',
          primary: true,
          organizationId: '5be02a02be151604dc7e8b6a',
        },
      ],
      userId: '5be02a02be151604dc7e8b68',
    },
    {
      _id: '5be02a02be151604dc7e8b6f',
      roles: ['user'],
      organizations: [
        {
          organizationRoles: ['member'],
          _id: '5be02a02be151604dc7e8b70',
          primary: true,
          organizationId: '5be02a02be151604dc7e8b6a',
        },
      ],
      userId: '5be02a02be151604dc7e8b6d',
    },
    {
      _id: '5be02a03be151604dc7e8b74',
      roles: ['user'],
      organizations: [
        {
          organizationRoles: ['member', 'admin'],
          _id: '5be02a03be151604dc7e8b75',
          primary: true,
          organizationId: '5be02a03be151604dc7e8b73',
        },
      ],
      userId: '5be02a03be151604dc7e8b71',
    },
    {
      _id: '5be02a03be151604dc7e8b79',
      roles: ['user', 'groupAdmin'],
      organizations: [
        {
          organizationRoles: ['member', 'admin'],
          _id: '5be02a03be151604dc7e8b7a',
          primary: true,
          organizationId: '5be02a03be151604dc7e8b78',
        },
      ],
      userId: '5be02a03be151604dc7e8b76',
    },
  ],
  cats: [
    {
      _id: '5b12aa6d93c31f1860b6f584',
      name: 'kitty',
      age: 5,
      breed: 'mixed',
    },
    {
      _id: '5b12ab4e0787689504ec417e',
      name: 'catty',
      age: 2,
      breed: 'tabby',
    },
  ],
};
