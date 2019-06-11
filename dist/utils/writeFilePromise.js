"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
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
exports.default = writeFilePromise;
