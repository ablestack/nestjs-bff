import { ReflectMetadata } from '@nestjs/common';
import { AuthorizationCheck } from '../../../../domain/authorization/authorizationchecks/authorizationcheck.abstract';

export const Authorization = (authorizationchecks: AuthorizationCheck[]) => ReflectMetadata('authorization', authorizationchecks);
