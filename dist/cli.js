#!/usr/bin/env node
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
const commander_1 = __importDefault(require("commander"));
const package_1 = __importDefault(require("./package"));
const findActions_1 = __importDefault(require("./findActions"));
const compileServer_1 = __importDefault(require("./compileServer"));
const compileClient_1 = __importDefault(require("./compileClient"));
const writeFilePromise_1 = __importDefault(require("./utils/writeFilePromise"));
commander_1.default
    .version(package_1.default.version, '-v, --version')
    .option('-r,--root <path>', 'Project root directory.', process.cwd())
    .option('-c,--client-out <path>', 'File path used to write the client library.')
    .option('-s,--server-out <path>', 'File path used to write the server library.')
    .parse(process.argv);
const { root, clientOut, serverOut } = commander_1.default;
main();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!serverOut && !clientOut) {
            console.log(`You must provide either a server or client out path with --server-out or --client-out.`);
            commander_1.default.outputHelp();
            process.exit(1);
        }
        console.time('done');
        console.log(`Discovering actions in ${root}`);
        const actions = yield findActions_1.default(root);
        if (actions.length === 0) {
            console.log(`No actions found in "${root}".`);
            process.exit(1);
        }
        const clientSrc = clientOut ? compileClient_1.default(actions) : null;
        const serverSrc = serverOut
            ? compileServer_1.default(actions, serverOut)
            : null;
        const writePromises = [];
        if (clientSrc) {
            writePromises.push(writeFilePromise_1.default(clientOut, clientSrc));
        }
        if (serverSrc) {
            writePromises.push(writeFilePromise_1.default(serverOut, serverSrc));
        }
        yield Promise.all(writePromises);
        console.timeEnd('done');
    });
}
