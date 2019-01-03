import { IEntity } from '@nestjs-bff/global/lib/interfaces/entity.interface';

export interface IEntityValidator {
 validate(entity: Partial<IEntity>, validationGroups?: string[]): Promise<void>;
}
