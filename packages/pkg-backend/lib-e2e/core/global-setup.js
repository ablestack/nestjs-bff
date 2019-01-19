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
// import { NestjsBffConfig } from '../../src/config/nestjs-bff.config';
const logging_shared_module_1 = require("../../src/shared/logging/logging.shared.module");
const test_object_literals_constants_1 = require("../core/test-object-literals.constants");
const global_setup_auth_1 = require("./global-setup-auth");
const global_setup_db_1 = require("./global-setup-db");
// Config
// @ts-ignore
// global.nestjs_bff = { NestjsBffConfig };
//
// Primary global setup function
//
exports.globalSetup = (globalConfig) => __awaiter(this, void 0, void 0, function* () {
    // Setup
    const logger = logging_shared_module_1.getLogger();
    logger.trace('Global Setup Start', Date.now().toLocaleString());
    // catch and highlight any unhandled exceptions
    process
        .on('unhandledRejection', (reason, p) => {
        console.error(reason, '-------------------------------------- Unhandled Rejection at Promise!!!!!!!!!!!!', p);
    })
        .on('uncaughtException', err => {
        console.error(err, '----------------------------------------- Uncaught Exception thrown!!!!!!!!!!!!!!');
    });
    // setup DB
    yield global_setup_db_1.setupDB(globalConfig);
    // setup test data literals
    yield test_object_literals_constants_1.setupTestDataJwtTokens();
    // add test users and auth
    yield global_setup_auth_1.setupAuth(globalConfig);
    logger.trace('Global Setup End');
});
//# sourceMappingURL=global-setup.js.map