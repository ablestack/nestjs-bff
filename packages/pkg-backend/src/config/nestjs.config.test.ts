import { extractKey } from '../shared/utils/key.shared.utils';
import { INestjsBffConfigEnv } from './nestjs.config.env.interface';

export const NestjsBffConfigEnv: INestjsBffConfigEnv = {
  nodeEnv: 'test',
  db: {
    mongo: {
      mongoConnectionUri: 'mongodb://localhost',
      options: {
        dbName: 'my-nestjs-bff-app-e2e',
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
  jwt: {
    jwtPrivateKey: extractKey(`${process.cwd()}\\src\\config\\keys\\jwt.private-key.test.pem`),
    jwtPublicKey: extractKey(`${process.cwd()}\\src\\config\\keys\\jwt.public-key.test.pem`),
  },
};
