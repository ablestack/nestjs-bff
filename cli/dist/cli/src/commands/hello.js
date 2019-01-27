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
const inquirer_1 = require("inquirer");
exports.loggerService = null;
function askName() {
    return __awaiter(this, void 0, void 0, function* () {
        exports.loggerService.log(':wave:  Hello stranger!');
        const { name } = yield inquirer_1.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'What is your name?',
            },
        ]);
        return name;
    });
}
exports.command = 'hello';
exports.desc = `Let's get to know each other`;
exports.builder = {
    name: { type: 'string', required: false, description: 'your name' },
};
function handler({ name }) {
    return __awaiter(this, void 0, void 0, function* () {
        exports.loggerService.log(`Oh, nice to meet you, ${name || (yield askName())}!`);
    });
}
exports.handler = handler;
//# sourceMappingURL=hello.js.map