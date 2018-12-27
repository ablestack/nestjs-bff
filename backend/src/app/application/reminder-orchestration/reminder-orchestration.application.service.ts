import { Injectable } from '@nestjs/common';
import { ReminderArchiveDomainRepoWrite } from '../../domain/reminder-archive/repo/reminder-archive.domain.write-repo';
import { ReminderDomainRepoRead } from '../../domain/reminder/repo/reminder.read-repo';
import { ReminderDomainRepoWrite } from '../../domain/reminder/repo/reminder.write-repo';
import { SendReminderToArchiveCommand } from '../../global/commands/send-reminder-to-archive.command';

@Injectable()
export class ReminderOrchestrationApplicationService {
  constructor(
    private readonly reminderRepoRead: ReminderDomainRepoRead,
    private readonly reminderRepoWrite: ReminderDomainRepoWrite,
    private readonly reminderArchiveRepoWrite: ReminderArchiveDomainRepoWrite,
  ) {}

  public async sendReminderToArchive(cmd: SendReminderToArchiveCommand): Promise<void> {
    // get reminder
    const reminder = await this.reminderRepoRead.findOneById(cmd.reminderId);

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
