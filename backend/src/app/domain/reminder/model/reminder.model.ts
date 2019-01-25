import { Document } from 'mongoose';
import { ReminderEntity } from '@yourapp/global-contracts/lib/domain/reminder/reminder.entity';

export interface IReminderModel extends ReminderEntity, Document {}
