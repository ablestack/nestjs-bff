import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';

export class FooEntity implements IEntity {
  id?: any;
  readonly name: string = '';
  readonly slug: string = '';
  readonly userId: string = '';
  readonly orgId: string = '';
}
