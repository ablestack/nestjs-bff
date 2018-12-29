import { Module } from '@nestjs/common';
import { OrganizationOrchestrationModule as DomainOrganizationOrchestrationModule } from '../../../application/organization-orchestration/organization-orchestration.module';
import { HttpCoreModule } from '../core/core.module';
import { OrganizationOrchestrationController } from './organization-orchestration.controller';

@Module({
  imports: [HttpCoreModule, DomainOrganizationOrchestrationModule],
  controllers: [OrganizationOrchestrationController],
  providers: [],
  exports: [],
})
export class HttpOrganizationOrchestrationModule {}
