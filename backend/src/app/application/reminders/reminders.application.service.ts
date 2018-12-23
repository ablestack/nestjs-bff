import { UserDomainRepoCache } from '@nestjs-bff/backend/lib/domain/user/repo/user.domain.repo-cache';
import { Injectable } from '@nestjs/common';
import { ReminderDomainRepoWrite } from '../../domain/reminder/repo/reminder.domain.write-repo';
import { SendReminderToArchiveCommand } from '../../global/commands/send-reminder-to-archive.command';

@Injectable()
export class RemindersApplicationService {
  constructor(
    private readonly userRepoCache: UserDomainRepoCache,
    private readonly reminderRepoWrite: ReminderDomainRepoWrite,
  ) {}

  public async sendReminderToArchive(cmd: SendReminderToArchiveCommand): Promise<void> {
    // get reminder
    // remove from reminders
    // add to archive
    // this.reminderRepoWrite.create({ userId, userName: user.username, Title: cmd.title, Completed: false });
  }
}
