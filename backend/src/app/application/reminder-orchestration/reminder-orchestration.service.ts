import { AccessPermissionsContract } from '@nestjs-bff/global-contracts/lib/domain/access-permissions/access-permissions.contract';
import { Injectable } from '@nestjs/common';
import { SendReminderToArchiveCommand } from '@yourapp/global/lib/application/reminder-orchestration/send-reminder-to-archive.command';
import { ReminderArchiveRepo } from '../../domain/reminder-archive/repo/reminder-archive.repo';
import { ReminderRepo } from '../../domain/reminder/repo/reminder.repo';

@Injectable()
export class ReminderOrchestrationService {
  constructor(private readonly reminderRepo: ReminderRepo, private readonly reminderArchiveRepo: ReminderArchiveRepo) {}

  public async sendReminderToArchive(
    cmd: SendReminderToArchiveCommand,
    accessPermissions?: AccessPermissionsContract,
  ): Promise<void> {
    // get reminder
    const reminder = await this.reminderRepo.findById(cmd.reminderId, { accessPermissions });

    // remove from Reminder data store
    this.reminderRepo.delete(cmd.reminderId, { accessPermissions });

    // add to ReminderArchive data store
    this.reminderArchiveRepo.create(
      {
        title: reminder.title,
        deadline: reminder.deadline,
        complete: reminder.complete,
        userId: reminder.userId,
        orgId: reminder.orgId,
        archivedDate: new Date(),
      },
      { accessPermissions },
    );
  }
}
