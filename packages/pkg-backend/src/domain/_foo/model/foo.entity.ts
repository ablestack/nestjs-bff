import { UserAndOrgScopedEntity } from '@nestjs-bff/global/lib/entities/core/user-and-org-scoped.entity';
import { IsDefined, Length } from 'class-validator';

export class FooEntity extends UserAndOrgScopedEntity {
  @Length(5, 50)
  name?: string;

  @IsDefined()
  @Length(2, 20)
  slug?: string;
}
