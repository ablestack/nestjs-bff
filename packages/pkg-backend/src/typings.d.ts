import { UserPermissionsEntity } from './domain/authorization/model/user-permissions.entity';

declare module '*.json' {
  const value: any;
  export default value;
}

declare global {
  namespace Express {
    export interface Request {
      authorization?: UserPermissionsEntity;
    }
  }
}
