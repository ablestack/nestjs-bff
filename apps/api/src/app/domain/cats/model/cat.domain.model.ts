import { Document } from 'mongoose';
import { CatEntity } from '../../../universal/entities/cat.entity';

export interface ICatModel extends CatEntity, Document {}
