import { ReminderEntity } from '@nestjs-bff/global/entities/reminder.entity';
import { Document } from 'mongoose';

export interface IReminderModel extends ReminderEntity, Document {}
