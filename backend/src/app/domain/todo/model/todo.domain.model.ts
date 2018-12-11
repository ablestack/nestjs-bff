import { Document } from 'mongoose';
import { TodoEntity } from '../../../global/entities/todo.entity';

export interface ITodoModel extends TodoEntity, Document {}
