import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';

export class TodoEntity implements IEntity {
  id?: any;
  readonly Title: string = '';
  readonly Completed: boolean = false;
  readonly userId: string = '';
  readonly userName: string = '';
}
