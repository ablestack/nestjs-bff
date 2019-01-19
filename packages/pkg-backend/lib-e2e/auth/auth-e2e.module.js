"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../../src/host/http/application-services-host/auth/auth.module");
const attach_authentication_middleware_1 = require("../../src/host/http/core/middleware/attach-authentication.middleware");
const web_app_module_1 = require("../../src/host/http/web-app.module");
let AuthE2eModule = class AuthE2eModule {
    configure(consumer) {
        consumer.apply(attach_authentication_middleware_1.AttachAuthenticationHttpMiddleware).forRoutes({ path: '*', method: common_1.RequestMethod.ALL });
    }
};
AuthE2eModule = __decorate([
    common_1.Module({
        imports: [web_app_module_1.HttpWebAppModule, auth_module_1.HttpAuthModule],
        controllers: [],
        providers: [],
        exports: undefined,
    })
], AuthE2eModule);
exports.AuthE2eModule = AuthE2eModule;
//# sourceMappingURL=auth-e2e.module.js.map