import { AccessPermissionsContract } from '@nestjs-bff/global/lib/interfaces/access-permissions.contract';

declare module '*.json' {
  const value: any;
  export default value;
}

declare global {
  namespace Express {
    export interface Request {
      accessPermissions?: AccessPermissionsContract;
    }
  }
}
