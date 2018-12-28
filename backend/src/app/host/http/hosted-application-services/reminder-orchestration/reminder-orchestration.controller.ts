import { CheckUserParam } from '@nestjs-bff/backend/lib/domain/authorization/authorizationchecks/check-user-ownership.authorizationcheck';
import { Authorization } from '@nestjs-bff/backend/lib/host/http/core/decorators/authorization.decorator';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { ReminderOrchestrationApplicationService } from '../../../../application/reminder-orchestration/reminder-orchestration.service';
import { SendReminderToArchiveCommand } from '../../../../global/commands/send-reminder-to-archive.command';

@Controller('/reminder/:organizationSlug')
export class ReminderOrchestrationHttpController {
  constructor(private readonly reminderOrchestrationApplicationService: ReminderOrchestrationApplicationService) {}

  @Post(':userId/sendReminderToArchive')
  @Authorization([new CheckUserParam()])
  public async sendReminderToArchive(@Req() req, @Body() cmd: SendReminderToArchiveCommand) {
    this.reminderOrchestrationApplicationService.sendReminderToArchive(cmd);
  }
}
