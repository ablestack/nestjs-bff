import { Component } from '@angular/core';
import { ReminderDataService } from './reminder-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './reminders.component.html',
  styleUrls: ['./reminders.component.css'],
  providers: [],
})
export class AppComponent {
  constructor(private reminderDataService: ReminderDataService) {}

  onAddReminder(reminder) {
    this.reminderDataService.addReminder(reminder);
  }

  onToggleReminderComplete(reminder) {
    this.reminderDataService.toggleReminderComplete(reminder);
  }

  onRemoveReminder(reminder) {
    this.reminderDataService.deleteReminderById(reminder.id);
  }

  get reminders() {
    return this.reminderDataService.getAllReminders();
  }
}
