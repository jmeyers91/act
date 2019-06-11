"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = __importDefault(require("path"));
const handlebars_1 = __importDefault(require("handlebars"));
const templateRoot = path_1.default.resolve(__dirname, '..', 'templates');
exports.clientTemplate = loadTemplate('client');
exports.serverTemplate = loadTemplate('server');
function loadTemplate(name) {
    const templatePath = path_1.default.join(templateRoot, `${name}.hbs`);
    const templateSrc = fs_1.readFileSync(templatePath, 'utf8');
    return handlebars_1.default.compile(templateSrc);
}
