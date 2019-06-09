"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const findActionModules_1 = __importDefault(require("./findActionModules"));
const templates_1 = require("./templates");
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const rootPath = path_1.default.resolve(process.argv[2] || process.cwd());
        console.log(`Starting in ${rootPath}`);
        const actions = yield findActionModules_1.default(rootPath);
        const clientSrc = templates_1.clientTemplate({
            actions
        });
        fs_1.default.writeFileSync("./out.json", JSON.stringify(actions, null, 2));
        fs_1.default.writeFileSync("./client.ts", clientSrc);
    });
}
