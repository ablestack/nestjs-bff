import { ReflectMetadata } from '@nestjs/common';
import { AuthCheckContract } from '../../../../domain/core/authchecks/authcheck.contract';

export const Authorization = (authchecks: Array<AuthCheckContract<any>>) => ReflectMetadata('authorization', authchecks);
