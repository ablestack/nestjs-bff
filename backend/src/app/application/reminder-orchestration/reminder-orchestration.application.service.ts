import { Injectable } from '@nestjs/common';
import { ReminderArchiveDomainRepoWrite } from '../../domain/reminder-archive/repo/reminder-archive.domain.write-repo';
import { ReminderDomainRepo } from '../../domain/reminder/repo/reminder.repo';
import { ReminderDomainRepoWrite } from '../../domain/reminder/repo/reminder.write-repo';
import { SendReminderToArchiveCommand } from '../../global/commands/send-reminder-to-archive.command';

@Injectable()
export class ReminderOrchestrationApplicationService {
  constructor(
    private readonly reminderRepo: ReminderDomainRepo,
    private readonly reminderRepoWrite: ReminderDomainRepoWrite,
    private readonly reminderArchiveRepoWrite: ReminderArchiveDomainRepoWrite,
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
