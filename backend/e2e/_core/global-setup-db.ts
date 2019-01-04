import { getLogger } from '@nestjs-bff/backend/lib/shared/logging/logging.shared.module';
import * as mongoose from 'mongoose';
import { AppConfig } from '../../src/config/app.config';

const logger = getLogger();
const DISPOSABLE_DB_MARKER_TABLE_NAME = '-this-is-a-disposable-test-db';

export const setupDB = async globalConfig => {
  // Database
  await mongoose.connect(
    AppConfig.db.mongo.mongoConnectionUri,
    AppConfig.db.mongo.options,
  );

  await setupDBWithVerification();

  mongoose.disconnect();
};

const setupDBWithVerification = async () => {
  // check if DB exists
  if (!(await verifyDoesDbExist())) {
    return createDisposableTestDb();
  }

  // check if disposable DB, and only drop if true
  if (await verifyIsDisposableDb()) {
    return resetDataInTestDb();
  }

  return;
};

//
// internal helper functions
//
const verifyDoesDbExist = async () => {
  const result = await mongoose.connection.db.admin().listDatabases();
  // logger.debug('databases found', result);
  const doesDbExist = !!result.databases.find(item => item.name === AppConfig.db.mongo.options.dbName);
  logger.info(`-- Does '${AppConfig.db.mongo.options.dbName}' Database Exist:`, doesDbExist);
  return doesDbExist;
};

// Function to look for marker collection to indicate if this is a disposable database that can be dropped
const verifyIsDisposableDb = async () => {
  let isDisposableTestDb = false;

  const collectionCursor = await mongoose.connection.db.listCollections({ name: DISPOSABLE_DB_MARKER_TABLE_NAME });
  const collectionArray = await collectionCursor.toArray();
  if (collectionArray.length > 0) {
    isDisposableTestDb = true;
  }

  if (isDisposableTestDb) logger.info(`-- Database verified as disposable: ${AppConfig.db.mongo.options.dbName}`);
  else logger.info(`-- Database either does not exist or is not disposable: ${AppConfig.db.mongo.options.dbName}`);

  return isDisposableTestDb;
};

// Database Reset
const resetDataInTestDb = async () => {
  logger.info(`-- Resetting data in disposable test DB ${AppConfig.db.mongo.options.dbName}`);
  await deleteDb();
  return createDisposableTestDb();
};

// Database Delete
const deleteDb = async () => {
  logger.info(`-- Dropping DB ${AppConfig.db.mongo.options.dbName}`);
  return mongoose.connection.db.dropDatabase();
};

// Database Create
const createDisposableTestDb = async () => {
  logger.info(`-- Creating disposable test DB ${AppConfig.db.mongo.options.dbName}`);
  return mongoose.connection.createCollection(DISPOSABLE_DB_MARKER_TABLE_NAME);
};
