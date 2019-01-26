import { Injectable } from '@angular/core';
import { TestingUtils } from '@nestjs-bff/global-utils-dev/lib/testing.utils';
import { ReminderEntity } from '@yourapp/global-contracts/lib/domain/reminder/reminder.entity';

@Injectable({
  providedIn: 'root',
})
export class ReminderDataService {
  // Placeholder for last id so we can simulate
  // automatic incrementing of ids
  lastId = 0;

  // Placeholder for reminders
  reminders: ReminderEntity[] = [];

  constructor() {}

  // Simulate POST /reminders
  addReminder(reminder: ReminderEntity): ReminderDataService {
    if (!reminder.id) {
      reminder.id = TestingUtils.generateMongoObjectIdString();
    }
    this.reminders.push(reminder);
    return this;
  }

  // Simulate DELETE /reminders/:id
  deleteReminderById(id: string): ReminderDataService {
    this.reminders = this.reminders.filter(reminder => reminder.id !== id);
    return this;
  }

  // Simulate PUT /reminders/:id
  updateReminderById(id: string, values: Object = {}): ReminderEntity {
    const reminder = this.getReminderById(id);
    if (!reminder) {
      return null;
    }
    Object.assign(reminder, values);
    return reminder;
  }

  // Simulate GET /reminders
  getAllReminders(): ReminderEntity[] {
    return this.reminders;
  }

  // Simulate GET /reminders/:id
  getReminderById(id: string): ReminderEntity {
    return this.reminders.filter(reminder => reminder.id === id).pop();
  }

  // Toggle reminder complete
  toggleReminderComplete(reminder: ReminderEntity) {
    const updatedReminder = this.updateReminderById(reminder.id, {
      complete: !reminder.complete,
    });
    return updatedReminder;
  }
}
