"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nestjs_bff_config_1 = require("@nestjs-bff/backend/lib/config/nestjs-bff.config");
const _ = require("lodash");
const app_config_env_1 = require("./app.config.env");
const nest_bff_overrides_config_1 = require("./nest-bff-overrides.config");
exports._AppConfig = {
    caching: {
        entities: {
            reminder: 60 * 5,
            reminderArchive: 60 * 60 * 24,
        },
    },
};
exports.AppConfig = _.merge(nestjs_bff_config_1.NestjsBffConfig, nest_bff_overrides_config_1.NestBffConfigOverrides, exports._AppConfig, app_config_env_1.AppConfigEnv);
//# sourceMappingURL=app.config.js.map