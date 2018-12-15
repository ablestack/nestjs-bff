import { ReflectMetadata } from '@nestjs/common';
import { AuthorizationTest } from '../../../../domain/authorization/authorization-tests/authorization-test.abstract';

export const Authorization = (authorizationtests: AuthorizationTest[]) => ReflectMetadata('authorization', authorizationtests);
