"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const templates_1 = require("./templates");
function compileServerModule(actions, outPath) {
    const actionsWithImportPaths = actions.map(action => (Object.assign({}, action, { importPath: getServerActionImportPath(outPath, action) })));
    return templates_1.serverTemplate({
        actions: actionsWithImportPaths
    });
}
exports.default = compileServerModule;
function getServerActionImportPath(outPath, action) {
    return ('./' +
        path_1.default.relative(path_1.default.parse(outPath).dir, action.filePath).replace(/\.ts$/, ''));
}
