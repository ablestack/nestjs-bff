import { Schema } from 'mongoose';

export const AuthenticationSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    local: {
      email: { type: String, lowercase: true, unique: true, sparse: true },
      hashedPassword: String,
    },
    google: {
      id: String,
      accessToken: String,
      email: String,
      name: String,
    },
    facebook: {
      id: String,
      accessToken: String,
      name: String,
      email: String,
    },
    twitter: {
      id: String,
      accessToken: String,
      displayName: String,
      username: String,
    },
  },
  {
    timestamps: true,
    collection: 'authentication',
  },
);
