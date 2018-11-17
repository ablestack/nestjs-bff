import { CreateOrganizationMemberCommand } from '@nestjs-bff/universal/commands/auth/create-organization-member.command';
import { OrganizationRoles } from '@nestjs-bff/universal/constants/roles.constants';
import { Body, Controller, Post } from '@nestjs/common';
import { OrganizationApplicationService } from '../../../application/organization/organization.application.service';
import { CheckOrganizationRoles } from '../../../domain/authorization/authorization-tests/check-organization-roles.authtest';
import { Authorization } from '../core/decorators/authorization.http.decorator';

@Controller('organization')
export class OrganizationHttpController {
  constructor(
    private readonly organizationService: OrganizationApplicationService,
  ) {}

  @Post('create-member')
  @Authorization([new CheckOrganizationRoles([OrganizationRoles.admin])])
  async createOrganizationMember(
    @Body() cmd: CreateOrganizationMemberCommand,
  ): Promise<void> {
    await this.organizationService.createMember(cmd);
  }
}
