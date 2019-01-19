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
describe('Trace', () => {
    const logger = logging_shared_module_1.getLogger();
    beforeAll(() => __awaiter(this, void 0, void 0, function* () {
        logger.trace('-- beforeAll --', Date.now().toLocaleString());
    }), 5 * 60 * 1000);
    it('adds 1 + 2 to equal 3 in TScript', () => __awaiter(this, void 0, void 0, function* () {
        logger.trace('-- during test --', Date.now().toLocaleString());
        expect(1 + 2).toBe(3);
    }));
    afterAll(() => __awaiter(this, void 0, void 0, function* () {
        logger.trace('-- afterAll --', Date.now().toLocaleString());
    }));
});
//# sourceMappingURL=trace.e2e-spec.js.map