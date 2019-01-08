import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';
import { ValidationError } from 'class-validator';

export interface IEntityValidator<TEntity extends IEntity> {
  validate(entity: Partial<TEntity>, validationGroups?: string[]): Promise<void>;
  tryValidate(entity: Partial<TEntity>, validationGroups?: string[]): Promise<ValidationError[]>;
}
