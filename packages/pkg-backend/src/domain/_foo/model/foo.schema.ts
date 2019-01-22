import { Schema } from 'mongoose';

export const FooSchema = new Schema(
  {
    name: {
      required: true,
      type: Schema.Types.String,
    },
    alwaysDefinedSlug: {
      required: true,
      type: Schema.Types.String,
    },
    orgId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: false,
    },
  },
  {
    timestamps: true,
    collection: 'foo',
  },
);
