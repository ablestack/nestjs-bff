import { DomainControllerBase } from '@nestjs-bff/backend/lib/host/http/core/controller/domain-controller-base';
import { Controller } from '@nestjs/common';
import { ReminderEntity } from '@yourapp/global/lib/domain/reminder/reminder.entity';
import { ReminderRepo } from '../../../../domain/reminder/repo/reminder.repo';

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
export class ReminderController extends DomainControllerBase<ReminderEntity> {
  constructor(reminderRepo: ReminderRepo) {
    super(reminderRepo);
  }
}
