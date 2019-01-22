export interface INestjsBffConfigEnv {
  readonly nodeEnv: 'dev' | 'test' | 'prod';
  db: {
    mongo: {
      mongoConnectionUri: string;
      options: {
        dbName: string;
      };
    };
  };
  http: {
    bffDomain: string;
    bffPort: number;
    bffRootUrl: string;
    spaDomain: string;
    spaPort: number;
    spaRootUrl: string;
  };
  social: {
    facebook: {
      clientID: string;
      clientSecret: string;
    };
  };
  jwt: {
    jwtPrivateKey: string;
    jwtPublicKey: string;
  };
}
