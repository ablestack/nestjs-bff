import { UserCredentialsContract } from '@nestjs-bff/global/lib/interfaces/credentials.contract';
import { Injectable } from '@nestjs/common';
import { ReminderArchiveRepo } from '../../domain/reminder-archive/repo/reminder-archive.repo';
import { ReminderRepo } from '../../domain/reminder/repo/reminder.repo';
import { SendReminderToArchiveCommand } from '../../global/commands/send-reminder-to-archive.command';

@Injectable()
export class ReminderOrchestrationService {
  constructor(private readonly reminderRepo: ReminderRepo, private readonly reminderArchiveRepo: ReminderArchiveRepo) {}

  public async sendReminderToArchive(
    cmd: SendReminderToArchiveCommand,
    credentials: UserCredentialsContract,
  ): Promise<void> {
    // get reminder
    const reminder = await this.reminderRepo.findOne({ id: cmd.reminderId });

    // remove from Reminder data store
    this.reminderRepo.delete(cmd.reminderId, { credentials });

    // add to ReminderArchive data store
    this.reminderArchiveRepo.create({
      Title: reminder.Title,
      Deadline: reminder.Deadline,
      Completed: reminder.Completed,
      userId: reminder.userId,
      orgId: reminder.orgId,
      archivedDate: new Date(),
    });
  }
}
