import { CreateOrganizationMemberCommand } from '@nestjs-bff/global/lib/commands/auth/create-organization-member.command';
import { OrganizationRoles } from '@nestjs-bff/global/lib/constants/roles.constants';
import { Body, Controller, Post, Req } from '@nestjs/common';
import { OrganizationOrchestrationService } from '../../../../application/organization-orchestration/organization-orchestration.service';
import { OrgRolesAuthCheck } from '../../../../shared/authchecks/org-roles.authcheck';
import { Authorization } from '../../core/decorators/authorization.decorator';
import { BffRequest } from '../../core/types/bff-request.contract';

@Controller('organization')
export class OrganizationOrchestrationController {
  constructor(private readonly organizationService: OrganizationOrchestrationService) {}

  @Post('create-member')
  @Authorization([new OrgRolesAuthCheck([OrganizationRoles.admin])])
  async createOrganizationMember(@Req() req: BffRequest, @Body() cmd: CreateOrganizationMemberCommand): Promise<void> {
    await this.organizationService.createMember(cmd, req.accessPermissions);
  }
}
