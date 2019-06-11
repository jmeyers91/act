"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const templates_1 = require("./templates");
function compileClientModule(actions) {
    return templates_1.clientTemplate({ actions });
}
exports.default = compileClientModule;
