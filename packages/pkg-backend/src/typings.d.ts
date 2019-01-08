import { AuthorizationEntity } from '@nestjs-bff/global/lib/entities/authorization.entity';

declare module '*.json' {
  const value: any;
  export default value;
}

declare global {
  namespace Express {
    export interface Request {
      authorization?: AuthorizationEntity;
    }
  }
}
