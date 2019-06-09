"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function properCase(input) {
    if (input.length === 0) {
        return "";
    }
    return input[0].toUpperCase() + input.slice(1);
}
exports.default = properCase;
