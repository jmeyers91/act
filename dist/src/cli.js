"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = __importDefault(require("commander"));
const package_json_1 = require("../package.json");
const { root, clientOut, serverOut } = new commander_1.default.Command()
    .version(package_json_1.version)
    .option('-r,--root', 'Project root directory. Defaults to the current directory.')
    .option('-c,--client-out', 'File path used to write the client library.')
    .option('-s,--server-out', 'File path used to write the server library.')
    .parse(process.argv);
console.log({ root, clientOut, serverOut });
