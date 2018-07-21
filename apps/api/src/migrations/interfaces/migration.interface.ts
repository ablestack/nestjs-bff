import { Document } from 'mongoose';

export enum MigrationState {
  Down = 'down',
  Up = 'up',
}

export interface Migration extends Document {
  readonly name: string;
  readonly createdAt: Date;
  readonly state: MigrationState;
  readonly filename: string;
}
