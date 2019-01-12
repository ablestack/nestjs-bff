import { AccessPermissionsEntity } from './domain/access-permissions/model/access-permissions.entity';

declare module '*.json' {
  const value: any;
  export default value;
}

declare global {
  namespace Express {
    export interface Request {
      authorization?: AccessPermissionsEntity;
    }
  }
}
