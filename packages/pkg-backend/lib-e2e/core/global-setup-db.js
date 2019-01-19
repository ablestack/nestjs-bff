"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const logging_shared_module_1 = require("../../src/shared/logging/logging.shared.module");
const logger = logging_shared_module_1.getLogger();
const DISPOSABLE_DB_MARKER_TABLE_NAME = '-this-is-a-disposable-test-db';
exports.setupDB = (globalConfig, nestJsBffConfig) => __awaiter(this, void 0, void 0, function* () {
    // Database
    yield mongoose.connect(nestJsBffConfig.db.mongo.mongoConnectionUri, nestJsBffConfig.db.mongo.options);
    yield setupDBWithVerification(globalConfig, nestJsBffConfig);
    mongoose.disconnect();
});
const setupDBWithVerification = (globalConfig, nestJsBffConfig) => __awaiter(this, void 0, void 0, function* () {
    // check if DB exists
    if (!(yield verifyDoesDbExist(globalConfig, nestJsBffConfig))) {
        return createDisposableTestDb(globalConfig, nestJsBffConfig);
    }
    // check if disposable DB, and only drop if true
    if (yield verifyIsDisposableDb(globalConfig, nestJsBffConfig)) {
        return resetDataInTestDb(globalConfig, nestJsBffConfig);
    }
    return;
});
//
// internal helper functions
//
const verifyDoesDbExist = (globalConfig, nestJsBffConfig) => __awaiter(this, void 0, void 0, function* () {
    const result = yield mongoose.connection.db.admin().listDatabases();
    // logger.debug('databases found', result);
    const doesDbExist = !!result.databases.find(item => item.name === nestJsBffConfig.db.mongo.options.dbName);
    logger.info(`-- Does '${nestJsBffConfig.db.mongo.options.dbName}' Database Exist:`, doesDbExist);
    return doesDbExist;
});
// Function to look for marker collection to indicate if this is a disposable database that can be dropped
const verifyIsDisposableDb = (globalConfig, nestJsBffConfig) => __awaiter(this, void 0, void 0, function* () {
    let isDisposableTestDb = false;
    const collectionCursor = yield mongoose.connection.db.listCollections({ name: DISPOSABLE_DB_MARKER_TABLE_NAME });
    const collectionArray = yield collectionCursor.toArray();
    if (collectionArray.length > 0) {
        isDisposableTestDb = true;
    }
    if (isDisposableTestDb)
        logger.info(`-- Database verified as disposable: ${nestJsBffConfig.db.mongo.options.dbName}`);
    else
        logger.info(`Database either does not exist or is not disposable: ${nestJsBffConfig.db.mongo.options.dbName}`);
    return isDisposableTestDb;
});
// Database Reset
const resetDataInTestDb = (globalConfig, nestJsBffConfig) => __awaiter(this, void 0, void 0, function* () {
    logger.info(`Resetting data in disposable test DB ${nestJsBffConfig.db.mongo.options.dbName}`);
    yield deleteDb(globalConfig, nestJsBffConfig);
    return createDisposableTestDb(globalConfig, nestJsBffConfig);
});
// Database Delete
const deleteDb = (globalConfig, nestJsBffConfig) => __awaiter(this, void 0, void 0, function* () {
    logger.info(`Dropping DB ${nestJsBffConfig.db.mongo.options.dbName}`);
    return mongoose.connection.db.dropDatabase();
});
// Database Create
const createDisposableTestDb = (globalConfig, nestJsBffConfig) => __awaiter(this, void 0, void 0, function* () {
    logger.info(`Creating disposable test DB ${nestJsBffConfig.db.mongo.options.dbName}`);
    return mongoose.connection.createCollection(DISPOSABLE_DB_MARKER_TABLE_NAME);
});
//# sourceMappingURL=global-setup-db.js.map