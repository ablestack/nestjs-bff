import { Document } from 'mongoose';
import { ReminderArchiveEntity } from '../../../global/entities/reminder-archive.entity';

export interface IReminderArchiveModel extends ReminderArchiveEntity, Document {}
