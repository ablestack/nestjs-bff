#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require("yargs");
const app_config_1 = require("../../backend/src/config/app.config");
const logging_shared_module_1 = require("@nestjs-bff/backend/lib/shared/logging/logging.shared.module");
app_config_1.AppConfig.appName = 'nestjs-bff-cli';
global.nestjs_bff = { config: app_config_1.AppConfig };
const bffLogger = logging_shared_module_1.getLogger();
yargs
    .env('BFFCLI')
    .commandDir('commands', {
    extensions: app_config_1.AppConfig.nodeEnv === 'dev' ? ['js', 'ts'] : ['js'],
    visit: (commandObject) => {
        commandObject.loggerService = bffLogger;
        return commandObject;
    },
})
    .demandCommand(1)
    .help()
    .version()
    .argv;
//# sourceMappingURL=cli.js.map