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
const logging_shared_module_1 = require("../../src/shared/logging/logging.shared.module");
exports.globalTearDown = (globalConfig) => __awaiter(this, void 0, void 0, function* () {
    const logger = logging_shared_module_1.getLogger();
    logger.trace('-- Global TearDown Start -- ');
    // No teardown currently configured. The TestDB resets in the global setup
    logger.trace('-- Global TearDown End -- ');
});
//# sourceMappingURL=global-tear-down.js.map