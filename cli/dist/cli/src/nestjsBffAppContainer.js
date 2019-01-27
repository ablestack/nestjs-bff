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
const core_1 = require("@nestjs/core");
const cliapp_module_1 = require("../../backend/src/app/host/cli/cliapp.module");
class NestjsBffAppContainer {
    static ensureInitialized() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!NestjsBffAppContainer.appInstance)
                yield core_1.NestFactory.create(cliapp_module_1.CliAppModule).then((nestApp) => {
                    this.appInstance = nestApp;
                });
        });
    }
}
exports.NestjsBffAppContainer = NestjsBffAppContainer;
//# sourceMappingURL=nestjsBffAppContainer.js.map