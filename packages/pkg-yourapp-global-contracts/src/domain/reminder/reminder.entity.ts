import { UserAndOrgScopedEntity } from '@nestjs-bff/global-contracts/lib/domain/core/user-and-org-scoped.entity';
import { IsBoolean, IsDate, Length } from 'class-validator';

export class ReminderEntity extends UserAndOrgScopedEntity {
  @Length(2, 50)
  title?: string;

  @IsBoolean()
  complete?: boolean;

  @IsDate()
  deadline?: Date;
}
