import { Component, Output, EventEmitter } from '@angular/core';
import { Reminder } from '../reminder';

@Component({
  selector: 'app-reminder-list-header',
  templateUrl: './reminder-list-header.component.html',
  styleUrls: ['./reminder-list-header.component.css'],
})
export class ReminderListHeaderComponent {
  newReminder: Reminder = new Reminder();

  @Output()
  add: EventEmitter<Reminder> = new EventEmitter();

  constructor() {}

  addReminder() {
    this.add.emit(this.newReminder);
    this.newReminder = new Reminder();
  }
}
