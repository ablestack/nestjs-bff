import { ReminderArchiveEntity } from '@nestjs-bff/global/entities/reminder-archive.entity';
import { Document } from 'mongoose';

export interface IReminderArchiveModel extends ReminderArchiveEntity, Document {}
