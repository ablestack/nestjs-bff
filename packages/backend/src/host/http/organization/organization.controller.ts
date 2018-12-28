import { CreateOrganizationMemberCommand } from '@nestjs-bff/global/lib/commands/auth/create-organization-member.command';
import { OrganizationRoles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { Body, Controller, Post } from '@nestjs/common';
import { OrganizationApplicationService } from '../../../application/organization/organization.service';
import { CheckOrgRoles } from '../../../domain/authorization/authorizationchecks/check-org-roles.authorizationcheck';
import { Authorization } from '../core/decorators/authorization.decorator';

@Controller('organization')
export class OrganizationHttpController {
  constructor(private readonly organizationService: OrganizationApplicationService) {}

  @Post('create-member')
  @Authorization([new CheckOrgRoles([OrganizationRoles.admin])])
  async createOrganizationMember(@Body() cmd: CreateOrganizationMemberCommand): Promise<void> {
    await this.organizationService.createMember(cmd);
  }
}
