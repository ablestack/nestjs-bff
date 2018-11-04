import { Schema } from 'mongoose';

export const MigrationSchema = new Schema(
  {
    name: String,
    createdAt: Schema.Types.Date,
    state: {
      type: Schema.Types.String,
      enum: ['down', 'up'],
      default: 'down',
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret, options) => {
        delete ret._id;
        delete ret.id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

MigrationSchema.virtual('filename').get(function() {
  // @ts-ignore
  return `${this.createdAt.getTime()}-${this.name}.ts`;
});
