// import { UserAndOrgScopedEntity } from '@nestjs-bff/global-contracts/lib/entities/core/user-and-org-scoped.entity';
import { BaseEntity } from '@nestjs-bff/global-contracts/lib/domain/core/base.entity';
import { IsDefined, IsNotEmpty, Length } from 'class-validator';

export class FooEntity extends BaseEntity {
  @IsNotEmpty()
  public userId: string | undefined = undefined;

  @IsNotEmpty()
  public orgId: string | undefined = undefined;

  @Length(5, 50)
  name?: string;

  @IsDefined()
  @Length(2, 20)
  alwaysDefinedSlug?: string;
}
