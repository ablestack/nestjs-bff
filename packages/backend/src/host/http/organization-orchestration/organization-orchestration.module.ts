import { Module } from '@nestjs/common';
import { OrganizationOrchestrationModule as DomainOrganizationOrchestrationModule } from '../../../application/organization-orchestration/organization-orchestration.module';
import { CoreModule } from '../core/core.module';
import { OrganizationOrchestrationController } from './organization-orchestration.controller';

@Module({
  imports: [CoreModule, DomainOrganizationOrchestrationModule],
  controllers: [OrganizationOrchestrationController],
  providers: [],
  exports: [],
})
export class OrganizationOrchestrationModule {}
