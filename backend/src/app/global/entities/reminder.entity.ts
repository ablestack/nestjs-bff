import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';

export class ReminderEntity implements IEntity {
  id?: any;
  readonly Title: string = '';
  readonly Deadline: Date = new Date();
  readonly Completed: boolean = false;
  readonly userId: string = '';
}
