import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Reminder } from '../reminder';

@Component({
  selector: 'app-reminder-list-item',
  templateUrl: './reminder-list-item.component.html',
  styleUrls: ['./reminder-list-item.component.css'],
})
export class ReminderListItemComponent {
  @Input() reminder: Reminder;

  @Output()
  remove: EventEmitter<Reminder> = new EventEmitter();

  @Output()
  toggleComplete: EventEmitter<Reminder> = new EventEmitter();

  constructor() {}

  toggleReminderComplete(reminder: Reminder) {
    this.toggleComplete.emit(reminder);
  }

  removeReminder(reminder: Reminder) {
    this.remove.emit(reminder);
  }
}
