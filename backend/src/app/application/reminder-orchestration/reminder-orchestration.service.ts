import { Injectable } from '@nestjs/common';
import { ReminderArchiveRepoWrite } from '../../domain/reminder-archive/repo/reminder-archive.write-repo';
import { ReminderRepo } from '../../domain/reminder/repo/reminder.repo';
import { ReminderRepoWrite } from '../../domain/reminder/repo/reminder.write-repo';
import { SendReminderToArchiveCommand } from '../../global/commands/send-reminder-to-archive.command';

@Injectable()
export class ReminderOrchestrationApplicationService {
  constructor(
    private readonly reminderRepo: ReminderRepo,
    private readonly reminderRepoWrite: ReminderRepoWrite,
    private readonly reminderArchiveRepoWrite: ReminderArchiveRepoWrite,
  ) {}

  public async sendReminderToArchive(cmd: SendReminderToArchiveCommand): Promise<void> {
    // get reminder
    const reminder = await this.reminderRepo.findOneById(cmd.reminderId);

    // remove from Reminder data store
    this.reminderRepoWrite.delete(cmd.reminderId);

    // add to ReminderArchive data store
    this.reminderArchiveRepoWrite.create({
      Title: reminder.Title,
      Deadline: reminder.Deadline,
      Completed: reminder.Completed,
      userId: reminder.userId,
      archivedDate: new Date(),
    });
  }
}
