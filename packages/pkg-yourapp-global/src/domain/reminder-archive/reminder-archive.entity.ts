import { UserAndOrgScopedEntity } from '@nestjs-bff/global/lib/domain/core/user-and-org-scoped.entity';
import { IsBoolean, IsDate, Length } from 'class-validator';

export class ReminderArchiveEntity extends UserAndOrgScopedEntity {
  @Length(2, 50)
  title?: string;

  @IsDate()
  deadline?: Date;

  @IsBoolean()
  completed?: boolean;

  @IsDate()
  archivedDate?: Date;
}
