import { TestBed, inject } from '@angular/core/testing';
import { ReminderDataService } from './reminder-data.service';
import { TestingUtils } from '@nestjs-bff/global-utils-dev/lib/testing.utils';
import { ReminderEntity } from '@yourapp/global-contracts/lib/domain/reminder/reminder.entity';

describe('ReminderDataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReminderDataService],
    });
  });

  it('should ...', inject([ReminderDataService], (service: ReminderDataService) => {
    expect(service).toBeTruthy();
  }));

  describe('#getAllReminders()', () => {
    it('should return an empty array by default', inject([ReminderDataService], (service: ReminderDataService) => {
      expect(service.getAllReminders()).toEqual([]);
    }));

    it('should return all reminders', inject([ReminderDataService], (service: ReminderDataService) => {
      const reminder1 = new ReminderEntity({ title: 'Hello 1', complete: false });
      const reminder2 = new ReminderEntity({ title: 'Hello 2', complete: true });
      service.addReminder(reminder1);
      service.addReminder(reminder2);
      expect(service.getAllReminders()).toEqual([reminder1, reminder2]);
    }));
  });

  describe('#save(reminder)', () => {
    it('should successfully get reminder by id', inject([ReminderDataService], (service: ReminderDataService) => {
      const reminder1 = new ReminderEntity({ title: 'Hello 1', complete: false });
      const reminder2 = new ReminderEntity({ title: 'Hello 2', complete: true });
      service.addReminder(reminder1);
      service.addReminder(reminder2);
      expect(service.getReminderById(reminder1.id)).toEqual(reminder1);
      expect(service.getReminderById(reminder2.id)).toEqual(reminder2);
    }));
  });

  describe('#deleteReminderById(id)', () => {
    it('should remove reminder with the corresponding id', inject([ReminderDataService], (service: ReminderDataService) => {
      const reminder1 = new ReminderEntity({ title: 'Hello 1', complete: false });
      const reminder2 = new ReminderEntity({ title: 'Hello 2', complete: true });
      service.addReminder(reminder1);
      service.addReminder(reminder2);
      expect(service.getAllReminders()).toEqual([reminder1, reminder2]);
      service.deleteReminderById(reminder1.id);
      expect(service.getAllReminders()).toEqual([reminder2]);
      service.deleteReminderById(reminder2.id);
      expect(service.getAllReminders()).toEqual([]);
    }));

    it('should not removing anything if reminder with corresponding id is not found', inject(
      [ReminderDataService],
      (service: ReminderDataService) => {
        const reminder1 = new ReminderEntity({ title: 'Hello 1', complete: false });
        const reminder2 = new ReminderEntity({ title: 'Hello 2', complete: true });
        service.addReminder(reminder1);
        service.addReminder(reminder2);
        expect(service.getAllReminders()).toEqual([reminder1, reminder2]);
        service.deleteReminderById(TestingUtils.generateMongoObjectIdString());
        expect(service.getAllReminders()).toEqual([reminder1, reminder2]);
      },
    ));
  });

  describe('#updateReminderById(id, values)', () => {
    it('should return reminder with the corresponding id and updated data', inject(
      [ReminderDataService],
      (service: ReminderDataService) => {
        const reminder = new ReminderEntity({ title: 'Hello 1', complete: false });
        service.addReminder(reminder);
        const updatedReminder = service.updateReminderById(reminder.id, {
          title: 'new title',
        });
        expect(updatedReminder.title).toEqual('new title');
      },
    ));

    it('should return null if reminder is not found', inject([ReminderDataService], (service: ReminderDataService) => {
      const reminder = new ReminderEntity({ title: 'Hello 1', complete: false });
      service.addReminder(reminder);
      const updatedReminder = service.updateReminderById(TestingUtils.generateMongoObjectIdString(), {
        title: 'new title',
      });
      expect(updatedReminder).toEqual(null);
    }));
  });

  describe('#toggleReminderComplete(reminder)', () => {
    it('should return the updated reminder with inverse complete status', inject([ReminderDataService], (service: ReminderDataService) => {
      const reminder = new ReminderEntity({ title: 'Hello 1', complete: false });
      service.addReminder(reminder);
      const updatedReminder = service.toggleReminderComplete(reminder);
      expect(updatedReminder.complete).toEqual(true);
      service.toggleReminderComplete(reminder);
      expect(updatedReminder.complete).toEqual(false);
    }));
  });
});
