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
exports.command = 'migration-custom';
exports.desc = `Runs a custom migration`;
exports.builder = {
    filename: { type: 'string', required: true, description: 'custom migration file' },
    direction: { type: 'string', required: true, description: 'the migration direction to run: up or down' },
};
function handler({ filename, direction }) {
    return __awaiter(this, void 0, void 0, function* () {
        yield nestjsBffAppContainer_1.NestjsBffAppContainer.ensureInitialized().then(() => {
            const migrationService = nestjsBffAppContainer_1.NestjsBffAppContainer.appInstance.get(migrations_shared_service_1.MigrationsSharedService);
            migrationService
                .runCustomMigration(direction, filename)
                .then(() => {
                process.exit(0);
            })
                .catch(() => {
                process.exit(0);
            });
        });
    });
}
exports.handler = handler;
//# sourceMappingURL=MigrationCustom.js.map