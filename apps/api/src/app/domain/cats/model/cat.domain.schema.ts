import { Schema } from 'mongoose';

export const CatSchema = new Schema(
  {
    name: {
      required: true,
      type: Schema.Types.String,
    },
    age: {
      required: true,
      type: Schema.Types.Number,
    },
    breed: {
      required: false,
      type: Schema.Types.String,
    },
  },
  {
    timestamps: true,
  },
);
