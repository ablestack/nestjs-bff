import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Reminder } from '../reminder';

@Component({
  selector: 'app-reminder-list',
  templateUrl: './reminder-list.component.html',
  styleUrls: ['./reminder-list.component.css'],
})
export class ReminderListComponent {
  @Input()
  reminders: Reminder[];

  @Output()
  remove: EventEmitter<Reminder> = new EventEmitter();

  @Output()
  toggleComplete: EventEmitter<Reminder> = new EventEmitter();

  constructor() {}

  onToggleReminderComplete(reminder: Reminder) {
    this.toggleComplete.emit(reminder);
  }

  onRemoveReminder(reminder: Reminder) {
    this.remove.emit(reminder);
  }
}
