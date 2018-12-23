import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';

export class ReminderArchiveEntity implements IEntity {
  id?: any;
  readonly Title: string = '';
  readonly Deadline: Date = new Date();
  readonly Completed: boolean = false;
  readonly userId: string = '';
  readonly archivedDate: Date = new Date();
}
