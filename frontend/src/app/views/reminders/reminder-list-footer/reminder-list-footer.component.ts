import { Component, Input } from '@angular/core';
import { Reminder } from '../reminder';

@Component({
  selector: 'app-reminder-list-footer',
  templateUrl: './reminder-list-footer.component.html',
  styleUrls: ['./reminder-list-footer.component.css'],
})
export class ReminderListFooterComponent {
  @Input()
  reminders: Reminder[];

  constructor() {}
}
