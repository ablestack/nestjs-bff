import { Document } from 'mongoose';
import { ReminderEntity } from '../../../global/entities/reminder.entity';

export interface IReminderModel extends ReminderEntity, Document {}
