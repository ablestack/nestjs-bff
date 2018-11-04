import { INestjsBffConfigEnv } from './nestjs.config.env.interface';

export const NestjsBffConfigEnv: INestjsBffConfigEnv = {
  nodeEnv: 'test',
  db: {
    mongo: {
      mongoConnectionUri: 'mongodb://localhost',
      options: {
        dbName: 'nestjs-bff-e2e',
      },
    },
  },
  http: {
    bffDomain: 'localhost',
    bffPort: 1337,
    get bffRootUrl() {
      return `http://${this.bffDomain}:${this.bffPort}`;
    },
    spaDomain: 'localhost',
    spaPort: 4200,
    get spaRootUrl() {
      return `http://${this.spaDomain}:${this.spaPort}`;
    },
  },
  social: {
    facebook: {
      clientID: 'your-secret-clientID-here', // your App ID
      clientSecret: 'your-client-secret-here', // your App Secret
    },
  },
};
