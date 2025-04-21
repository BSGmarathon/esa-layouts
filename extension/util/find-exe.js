"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
/**
 * Adapted from a script sourced from:
 * https://abdus.dev/posts/checking-executable-exists-in-path-using-node/
 */
async function checkFileExists(filePath) {
    if ((await promises_1.default.stat(filePath)).isFile()) {
        return filePath;
    }
    throw new Error('Not a file');
}
/**
 * @param {string} exe executable name (without extension if on Windows)
 * @return {Promise<string|null>} executable path if found
 * */
async function findExecutable(exe) {
    const envPath = process.env.PATH || '';
    const envExt = process.env.PATHEXT || '';
    const pathDirs = envPath
        .replace(/["]+/g, '')
        .split(path_1.default.delimiter)
        .filter(Boolean);
    const extensions = envExt.split(';');
    const candidates = pathDirs.flatMap((d) => extensions.map((ext) => path_1.default.join(d, exe + ext)));
    try {
        // @ts-expect-error https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/any
        // eslint-disable-next-line @typescript-eslint/return-await
        return await Promise.any(candidates.map(checkFileExists));
    }
    catch (e) {
        return null;
    }
}
exports.default = findExecutable;
