import { CatSchema } from './schemas/cat.schema';

export const catsProviders = [
  {
    provide: 'CatModelToken',
    useFactory: mongoose => mongoose.connection.model('Cat', CatSchema),
    inject: ['MongooseConnectionToken'],
  },
];
