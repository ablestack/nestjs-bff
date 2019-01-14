import { UserAndOrgScopedEntity } from '@nestjs-bff/global/lib/entities/core/user-and-org-scoped.entity';
import { IsBoolean, IsDate, Length } from 'class-validator';

export class ReminderEntity extends UserAndOrgScopedEntity {
  @Length(2, 50)
  title?: string;

  @IsDate()
  deadline?: Date;

  @IsBoolean()
  completed?: boolean;
}
