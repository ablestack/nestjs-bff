import { AccessPermissionsContract } from '@nestjs-bff/global/lib/interfaces/access-permissions.contract';
import { Injectable } from '@nestjs/common';
import { ReminderArchiveRepo } from '../../domain/reminder-archive/repo/reminder-archive.repo';
import { ReminderRepo } from '../../domain/reminder/repo/reminder.repo';
import { SendReminderToArchiveCommand } from '../../global/commands/send-reminder-to-archive.command';

@Injectable()
export class ReminderOrchestrationService {
  constructor(private readonly reminderRepo: ReminderRepo, private readonly reminderArchiveRepo: ReminderArchiveRepo) {}

  public async sendReminderToArchive(
    cmd: SendReminderToArchiveCommand,
    accessPermissions?: AccessPermissionsContract,
  ): Promise<void> {
    // get reminder
    const reminder = await this.reminderRepo.findOne({ _id: cmd.reminderId }, { accessPermissions });

    // remove from Reminder data store
    this.reminderRepo.delete(cmd.reminderId, { accessPermissions });

    // add to ReminderArchive data store
    this.reminderArchiveRepo.create(
      {
        Title: reminder.title,
        Deadline: reminder.deadline,
        Completed: reminder.completed,
        userId: reminder.userId,
        orgId: reminder.orgId,
        archivedDate: new Date(),
      },
      { accessPermissions },
    );
  }
}
