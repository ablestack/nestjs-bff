// import { UserAndOrgScopedEntity } from '@nestjs-bff/global/lib/entities/core/user-and-org-scoped.entity';
import { BaseEntity } from '@nestjs-bff/global/lib/entities/core/base.entity';
import { IsDefined, IsMongoId, Length } from 'class-validator';

export class FooEntity extends BaseEntity {
  @IsMongoId()
  public userId: string | undefined = undefined;

  @IsMongoId()
  public orgId: string | undefined = undefined;

  @Length(5, 50)
  name?: string;

  @IsDefined()
  @Length(2, 20)
  alwaysDefinedSlug?: string;
}
