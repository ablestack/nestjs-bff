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
const migrations_shared_service_1 = require("@nestjs-bff/backend/lib/shared/migrations/migrations.shared.service");
const nestjsBffAppContainer_1 = require("../nestjsBffAppContainer");
exports.command = 'migrations-sync';
exports.desc = 'Imports any migrations that are on the file system but missing in the database.';
exports.builder = {};
function handler(argv) {
    return __awaiter(this, void 0, void 0, function* () {
        yield nestjsBffAppContainer_1.NestjsBffAppContainer.ensureInitialized().then(() => {
            const migrationService = nestjsBffAppContainer_1.NestjsBffAppContainer.appInstance.get(migrations_shared_service_1.MigrationsSharedService);
            migrationService.sync('', true).then(() => {
                process.exit(0);
            });
        });
    });
}
exports.handler = handler;
//# sourceMappingURL=MigrationsSync.js.map