import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { AppComponent } from './reminders.component';
import { ReminderListComponent } from './reminder-list/reminder-list.component';
import { ReminderListFooterComponent } from './reminder-list-footer/reminder-list-footer.component';
import { ReminderListHeaderComponent } from './reminder-list-header/reminder-list-header.component';
import { ReminderDataService } from './reminder-data.service';
import { ReminderListItemComponent } from './reminder-list-item/reminder-list-item.component';

@NgModule({
  declarations: [AppComponent, ReminderListComponent, ReminderListFooterComponent, ReminderListHeaderComponent, ReminderListItemComponent],
  imports: [BrowserModule, FormsModule, HttpClient],
  providers: [ReminderDataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
