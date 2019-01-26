import { ReminderArchiveEntity } from '@yourapp/global/lib/domain/reminder-archive/reminder-archive.entity';
import { Document } from 'mongoose';

export interface IReminderArchiveModel extends ReminderArchiveEntity, Document {}
