import { UserAndOrgScopedEntity } from '@nestjs-bff/global/lib/entities/core/user-and-org-scoped.entity';
import { Length } from 'class-validator';

export class FooEntity extends UserAndOrgScopedEntity {
  @Length(2, 50)
  name?: string;

  @Length(2, 50)
  slug?: string = undefined;
}
