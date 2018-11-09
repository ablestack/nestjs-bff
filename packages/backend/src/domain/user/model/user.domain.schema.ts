import { Schema } from 'mongoose';

export const UserDomainSchema: Schema = new Schema(
  {
    username: {
      type: Schema.Types.String,
      required: true,
    },
    displayName: {
      type: Schema.Types.String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'user',
  },
);
