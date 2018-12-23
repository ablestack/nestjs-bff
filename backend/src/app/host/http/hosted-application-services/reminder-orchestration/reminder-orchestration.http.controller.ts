import { CheckUserOwnership } from '@nestjs-bff/backend/lib/domain/authorization/authorization-tests/check-user-ownership.authorizationtest';
import { Authorization } from '@nestjs-bff/backend/lib/host/http/core/decorators/authorization.http.decorator';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { ReminderOrchestrationApplicationService } from '../../../../application/reminder-orchestration/reminder-orchestration.application.service';
import { SendReminderToArchiveCommand } from '../../../../global/commands/send-reminder-to-archive.command';

@Controller('/reminder/:organizationSlug')
export class ReminderOrchestrationHttpController {
  constructor(private readonly reminderOrchestrationApplicationService: ReminderOrchestrationApplicationService) {}

  @Post(':userId/sendReminderToArchive')
  @Authorization([new CheckUserOwnership()])
  public async sendReminderToArchive(@Req() req, @Body() cmd: SendReminderToArchiveCommand) {
    this.reminderOrchestrationApplicationService.sendReminderToArchive(cmd);
  }
}
