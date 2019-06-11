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
const fs_1 = require("fs");
const findActionModules_1 = __importDefault(require("./findActionModules"));
const compileServerModule_1 = __importDefault(require("./compileServerModule"));
const compileClientModule_1 = __importDefault(require("./compileClientModule"));
const rootPath = path_1.default.resolve(process.argv[2] || process.cwd());
const serverOutPath = process.argv[3] || path_1.default.join(rootPath, 'src', 'act-server.ts');
const clientOutPath = process.argv[4] || path_1.default.join(rootPath, 'src', 'act-client.ts');
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        console.time('done');
        console.log(`Starting in ${rootPath}`);
        const actions = yield findActionModules_1.default(rootPath);
        actions
            .map(action => `  ${action.actionName} - ${action.filePath}`)
            .forEach(s => console.log(s));
        const clientSrc = compileClientModule_1.default(actions);
        const serverSrc = compileServerModule_1.default(actions, serverOutPath);
        yield Promise.all([
            writeFilePromise(clientOutPath, clientSrc),
            writeFilePromise(serverOutPath, serverSrc)
        ]);
        console.timeEnd('done');
    });
}
function writeFilePromise(filePath, content) {
    return new Promise((resolve, reject) => {
        fs_1.writeFile(filePath, content, error => {
            if (error) {
                reject(error);
            }
            else {
                resolve();
            }
        });
    });
}
