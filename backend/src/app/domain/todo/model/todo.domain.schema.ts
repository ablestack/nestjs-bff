import { Schema } from 'mongoose';

export const TodoDomainSchema = new Schema(
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
    userName: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'todo',
  },
);
