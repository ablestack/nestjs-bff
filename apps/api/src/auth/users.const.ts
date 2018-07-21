import { User } from './interfaces/user.interface';

export const users: User[] = [
  {
    id: 1,
    username: 'user@mydomain.com',
    firstName: 'standard',
    lastName: 'user',
    password: 'user',
    roles: ['user'],
  },
  {
    id: 2,
    username: 'staff@mydomain.com',
    firstName: 'staff',
    lastName: 'user',
    password: 'staff',
    roles: ['user', 'staff'],
  },
];
