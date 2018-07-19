import { MigrationSchema } from './schemas/migration.schema';

export const migrationsProviders = [
  {
    provide: 'MigrationModelToken',
    useFactory: mongoose => mongoose.connection.model('Migration', MigrationSchema),
    inject: ['MongooseConnectionToken'],
  },
];
