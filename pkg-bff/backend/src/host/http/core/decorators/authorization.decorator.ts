import { ReflectMetadata } from '@nestjs/common';
import { AuthCheckContract } from '../../../../shared/authchecks/authcheck.contract';

export const Authorization = (authchecks: Array<AuthCheckContract<any, any>>) => ReflectMetadata('authorization', authchecks);
