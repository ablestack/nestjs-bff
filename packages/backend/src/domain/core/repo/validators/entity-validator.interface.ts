import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';

export interface IEntityValidator<TEntity extends IEntity> {
 validate(entity: Partial<TEntity>, validationGroups?: string[]): Promise<void>;
}
