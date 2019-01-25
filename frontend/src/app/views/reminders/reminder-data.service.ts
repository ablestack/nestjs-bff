import { Injectable } from '@angular/core';
import { Reminder } from './reminder';

@Injectable({
  providedIn: 'root',
})
export class ReminderDataService {
  // Placeholder for last id so we can simulate
  // automatic incrementing of ids
  lastId = 0;

  // Placeholder for reminders
  reminders: Reminder[] = [];

  constructor() {}

  // Simulate POST /reminders
  addReminder(reminder: Reminder): ReminderDataService {
    if (!reminder.id) {
      reminder.id = ++this.lastId;
    }
    this.reminders.push(reminder);
    return this;
  }

  // Simulate DELETE /reminders/:id
  deleteReminderById(id: number): ReminderDataService {
    this.reminders = this.reminders.filter(reminder => reminder.id !== id);
    return this;
  }

  // Simulate PUT /reminders/:id
  updateReminderById(id: number, values: Object = {}): Reminder {
    const reminder = this.getReminderById(id);
    if (!reminder) {
      return null;
    }
    Object.assign(reminder, values);
    return reminder;
  }

  // Simulate GET /reminders
  getAllReminders(): Reminder[] {
    return this.reminders;
  }

  // Simulate GET /reminders/:id
  getReminderById(id: number): Reminder {
    return this.reminders.filter(reminder => reminder.id === id).pop();
  }

  // Toggle reminder complete
  toggleReminderComplete(reminder: Reminder) {
    const updatedReminder = this.updateReminderById(reminder.id, {
      complete: !reminder.complete,
    });
    return updatedReminder;
  }
}
