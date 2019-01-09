import { Document } from 'mongoose';
import { FooEntity } from './foo.entity';

export interface IFooModel extends FooEntity, Document {}
