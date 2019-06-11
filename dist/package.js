"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const packageJSONPath = path_1.default.resolve(__dirname, '..', 'package.json');
const packageJSON = JSON.parse(fs_1.readFileSync(packageJSONPath, 'utf8'));
exports.default = packageJSON;
