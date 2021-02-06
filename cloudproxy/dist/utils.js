"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeEmptyFields = exports.deleteFolderRecursive = exports.sleep = void 0;
const fs = require("fs");
const Path = require("path");
const util_1 = require("util");
exports.sleep = util_1.promisify(setTimeout);
function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file) => {
            const curPath = Path.join(path, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                deleteFolderRecursive(curPath);
            }
            else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
exports.deleteFolderRecursive = deleteFolderRecursive;
exports.removeEmptyFields = (o) => {
    const r = {};
    for (const k in o) {
        if (o[k] !== undefined) {
            r[k] = o[k];
        }
    }
    return r;
};
//# sourceMappingURL=utils.js.map