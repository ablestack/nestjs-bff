import { UserAndOrgScopedEntity } from '@nestjs-bff/global/lib/entities/core/user-and-org-scoped.entity';
import { IsBoolean, IsDate, Length } from 'class-validator';

export class ReminderArchiveEntity extends UserAndOrgScopedEntity {
  @Length(2, 50)
  Title?: string;

  @IsDate()
  Deadline?: Date;

  @IsBoolean()
  Completed?: boolean;

  @IsDate()
  archivedDate?: Date;
}
