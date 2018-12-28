import { Schema } from 'mongoose';

export const ReminderDomainSchema = new Schema(
  {
    title: {
      required: true,
      type: Schema.Types.String,
    },
    completed: {
      required: true,
      type: Schema.Types.Boolean,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'reminder',
  },
);
