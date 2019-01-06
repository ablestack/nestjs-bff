import { ReflectMetadata } from '@nestjs/common';
import { AuthorizationCheck } from '../../../../domain/core/authorizationchecks/authorizationcheck';

export const Authorization = (authorizationchecks: AuthorizationCheck[]) => ReflectMetadata('authorization', authorizationchecks);
