import { DomainControllerBase } from '@nestjs-bff/backend/lib/host/http/core/controller/domain-controller-base';
import { Controller } from '@nestjs/common';
import { ReminderArchiveEntity } from '@yourapp/global-contracts/lib/domain/reminder-archive/reminder-archive.entity';
import { ReminderArchiveRepo } from '../../../../domain/reminder-archive/repo/reminder-archive.repo';

/*
  Domain Service Hosted Endpoints are RESTful. Inheriting from DomainControllerBase proves the following structure:

  GET /items - Retrieves a list of items
  GET /items/12 - Retrieves a specific item
  POST /items - Creates a new item
  PUT /items/12 - Updates item #12
  PATCH /items/12 - Partially updates item #12
  DELETE /items/12 - Deletes item #12

*/

@Controller('/reminder/:organizationSlug/:userId')
export class ReminderArchiveController extends DomainControllerBase<ReminderArchiveEntity> {
  constructor(reminderRepo: ReminderArchiveRepo) {
    super(reminderRepo);
  }
}
