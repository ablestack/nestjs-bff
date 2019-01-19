import * as mongoose from 'mongoose';
import { INestjsBffConfig } from '../../lib/config/nestjs-bff.config';
import { getLogger } from '../../src/shared/logging/logging.shared.module';

const logger = getLogger();
const DISPOSABLE_DB_MARKER_TABLE_NAME = '-this-is-a-disposable-test-db';

export const setupDB = async (globalConfig: any, nestJsBffConfig: INestjsBffConfig) => {
  // Database
  await mongoose.connect(
    nestJsBffConfig.db.mongo.mongoConnectionUri,
    nestJsBffConfig.db.mongo.options,
  );

  await setupDBWithVerification(globalConfig, nestJsBffConfig);

  mongoose.disconnect();
};

const setupDBWithVerification = async (globalConfig: any, nestJsBffConfig: INestjsBffConfig) => {
  // check if DB exists
  if (!(await verifyDoesDbExist(globalConfig, nestJsBffConfig))) {
    return createDisposableTestDb(globalConfig, nestJsBffConfig);
  }

  // check if disposable DB, and only drop if true
  if (await verifyIsDisposableDb(globalConfig, nestJsBffConfig)) {
    return resetDataInTestDb(globalConfig, nestJsBffConfig);
  }

  return;
};

//
// internal helper functions
//
const verifyDoesDbExist = async (globalConfig: any, nestJsBffConfig: INestjsBffConfig) => {
  const result = await mongoose.connection.db.admin().listDatabases();
  // logger.debug('databases found', result);
  const doesDbExist = !!result.databases.find(item => item.name === nestJsBffConfig.db.mongo.options.dbName);
  logger.info(`-- Does '${nestJsBffConfig.db.mongo.options.dbName}' Database Exist:`, doesDbExist);
  return doesDbExist;
};

// Function to look for marker collection to indicate if this is a disposable database that can be dropped
const verifyIsDisposableDb = async (globalConfig: any, nestJsBffConfig: INestjsBffConfig) => {
  let isDisposableTestDb = false;

  const collectionCursor = await mongoose.connection.db.listCollections({ name: DISPOSABLE_DB_MARKER_TABLE_NAME });
  const collectionArray = await collectionCursor.toArray();
  if (collectionArray.length > 0) {
    isDisposableTestDb = true;
  }

  if (isDisposableTestDb) logger.info(`-- Database verified as disposable: ${nestJsBffConfig.db.mongo.options.dbName}`);
  else logger.info(`Database either does not exist or is not disposable: ${nestJsBffConfig.db.mongo.options.dbName}`);

  return isDisposableTestDb;
};

// Database Reset
const resetDataInTestDb = async (globalConfig: any, nestJsBffConfig: INestjsBffConfig) => {
  logger.info(`Resetting data in disposable test DB ${nestJsBffConfig.db.mongo.options.dbName}`);
  await deleteDb(globalConfig, nestJsBffConfig);
  return createDisposableTestDb(globalConfig, nestJsBffConfig);
};

// Database Delete
const deleteDb = async (globalConfig: any, nestJsBffConfig: INestjsBffConfig) => {
  logger.info(`Dropping DB ${nestJsBffConfig.db.mongo.options.dbName}`);
  return mongoose.connection.db.dropDatabase();
};

// Database Create
const createDisposableTestDb = async (globalConfig: any, nestJsBffConfig: INestjsBffConfig) => {
  logger.info(`Creating disposable test DB ${nestJsBffConfig.db.mongo.options.dbName}`);
  return mongoose.connection.createCollection(DISPOSABLE_DB_MARKER_TABLE_NAME);
};
