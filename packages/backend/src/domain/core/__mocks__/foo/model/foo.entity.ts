import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';

export class FooEntity implements IEntity {
  id?: any;
  name?: string;
  slug?: string;
  userId?: string;
  orgId?: string;
}
