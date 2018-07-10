import * as mongoose from 'mongoose';

export const MigrationSchema = new mongoose.Schema(
  {
    name: String,
    createdAt: Date,
    state: {
      type: String,
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
  return `${this.createdAt.getTime()}-${this.name}.ts`;
});
