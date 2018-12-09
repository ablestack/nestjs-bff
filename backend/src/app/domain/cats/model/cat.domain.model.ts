import { Document } from 'mongoose';
import { CatEntity } from '../../../global/entities/cat.entity';

export interface ICatModel extends CatEntity, Document {}
