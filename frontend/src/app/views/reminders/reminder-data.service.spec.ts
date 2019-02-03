/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { Reminder } from './reminder';
import { ReminderDataService } from './reminder-data.service';

describe('ReminderDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReminderDataService],
    });
  });

  it('should ...', inject(
    [ReminderDataService],
    (service: ReminderDataService) => {
      expect(service).toBeTruthy();
    },
  ));

  describe('#getAllReminders()', () => {
    it('should return an empty array by default', inject(
      [ReminderDataService],
      (service: ReminderDataService) => {
        expect(service.getAllReminders()).toEqual([]);
      },
    ));

    it('should return all reminders', inject(
      [ReminderDataService],
      (service: ReminderDataService) => {
        let reminder1 = new Reminder({ title: 'Hello 1', complete: false });
        let reminder2 = new Reminder({ title: 'Hello 2', complete: true });
        service.addReminder(reminder1);
        service.addReminder(reminder2);
        expect(service.getAllReminders()).toEqual([reminder1, reminder2]);
      },
    ));
  });

  describe('#save(reminder)', () => {
    it('should automatically assign an incrementing id', inject(
      [ReminderDataService],
      (service: ReminderDataService) => {
        let reminder1 = new Reminder({ title: 'Hello 1', complete: false });
        let reminder2 = new Reminder({ title: 'Hello 2', complete: true });
        service.addReminder(reminder1);
        service.addReminder(reminder2);
        expect(service.getReminderById(1)).toEqual(reminder1);
        expect(service.getReminderById(2)).toEqual(reminder2);
      },
    ));
  });

  describe('#deleteReminderById(id)', () => {
    it('should remove reminder with the corresponding id', inject(
      [ReminderDataService],
      (service: ReminderDataService) => {
        let reminder1 = new Reminder({ title: 'Hello 1', complete: false });
        let reminder2 = new Reminder({ title: 'Hello 2', complete: true });
        service.addReminder(reminder1);
        service.addReminder(reminder2);
        expect(service.getAllReminders()).toEqual([reminder1, reminder2]);
        service.deleteReminderById(1);
        expect(service.getAllReminders()).toEqual([reminder2]);
        service.deleteReminderById(2);
        expect(service.getAllReminders()).toEqual([]);
      },
    ));

    it('should not removing anything if reminder with corresponding id is not found', inject(
      [ReminderDataService],
      (service: ReminderDataService) => {
        let reminder1 = new Reminder({ title: 'Hello 1', complete: false });
        let reminder2 = new Reminder({ title: 'Hello 2', complete: true });
        service.addReminder(reminder1);
        service.addReminder(reminder2);
        expect(service.getAllReminders()).toEqual([reminder1, reminder2]);
        service.deleteReminderById(3);
        expect(service.getAllReminders()).toEqual([reminder1, reminder2]);
      },
    ));
  });

  describe('#updateReminderById(id, values)', () => {
    it('should return reminder with the corresponding id and updated data', inject(
      [ReminderDataService],
      (service: ReminderDataService) => {
        let reminder = new Reminder({ title: 'Hello 1', complete: false });
        service.addReminder(reminder);
        let updatedReminder = service.updateReminderById(1, {
          title: 'new title',
        });
        expect(updatedReminder.title).toEqual('new title');
      },
    ));

    it('should return null if reminder is not found', inject(
      [ReminderDataService],
      (service: ReminderDataService) => {
        let reminder = new Reminder({ title: 'Hello 1', complete: false });
        service.addReminder(reminder);
        let updatedReminder = service.updateReminderById(2, {
          title: 'new title',
        });
        expect(updatedReminder).toEqual(null);
      },
    ));
  });

  describe('#toggleReminderComplete(reminder)', () => {
    it('should return the updated reminder with inverse complete status', inject(
      [ReminderDataService],
      (service: ReminderDataService) => {
        let reminder = new Reminder({ title: 'Hello 1', complete: false });
        service.addReminder(reminder);
        let updatedReminder = service.toggleReminderComplete(reminder);
        expect(updatedReminder.complete).toEqual(true);
        service.toggleReminderComplete(reminder);
        expect(updatedReminder.complete).toEqual(false);
      },
    ));
  });
});
