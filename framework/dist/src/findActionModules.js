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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const globby_1 = __importDefault(require("globby"));
const execa_1 = __importDefault(require("execa"));
const j2t = __importStar(require("json-schema-to-typescript"));
const properCase_1 = __importDefault(require("./utils/properCase"));
/**
 * Finds and resolves all action modules in a project.
 * @param projectRoot The project root directory.
 */
function findActionModules(projectRoot) {
    return __awaiter(this, void 0, void 0, function* () {
        const srcPath = path_1.default.join(projectRoot, "src");
        const actionFiles = yield globby_1.default("**/*.action.ts", { cwd: srcPath });
        return Promise.all(actionFiles
            .map(relativePath => path_1.default.join(srcPath, relativePath))
            .map(resolveAction));
    });
}
exports.default = findActionModules;
/**
 * Resolves an action module.
 * @param filePath The full path to the action file.
 */
function resolveAction(filePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const actionName = path_1.default.parse(filePath).name.replace(/\.action/, "");
        const optionsInterfaceName = `${properCase_1.default(actionName)}Options`;
        const resultInterfaceName = `${properCase_1.default(actionName)}Result`;
        const [optionsSchema, resultSchema] = yield Promise.all([
            getSchema(filePath, "Options"),
            getSchema(filePath, "Result")
        ]);
        const hasOptions = !!optionsSchema;
        const hasResult = !!resultSchema;
        const [optionsInterface, resultInterface] = yield Promise.all([
            optionsSchema &&
                j2t.compile(optionsSchema, optionsInterfaceName, { bannerComment: "" }),
            resultSchema &&
                j2t.compile(resultSchema, resultInterfaceName, { bannerComment: "" })
        ].filter((v) => !!v));
        return {
            actionName,
            filePath,
            optionsSchema,
            resultSchema,
            optionsInterface,
            resultInterface,
            optionsInterfaceName,
            resultInterfaceName,
            hasOptions,
            hasResult
        };
    });
}
/**
 * Searches the file at `filePath` for the type `typeName` and returns it as a JSON schema object.
 * Returns `null` if the type or file aren't found.
 * @param filePath The Typescript file to search.
 * @param typeName The type to turn into a schema.
 */
function getSchema(filePath, typeName) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = ["--defaultProps", "--strictNullChecks", "--required"];
        const binPath = path_1.default.resolve(__dirname, "..", "node_modules", ".bin", "typescript-json-schema");
        const contents = fs_1.readFileSync(filePath, "utf8");
        if (!contents.includes(`type ${typeName}`) &&
            !contents.includes(`interface ${typeName}`) &&
            !contents.includes(`class ${typeName}`)) {
            return null;
        }
        try {
            const { stdout } = yield execa_1.default(binPath, [...options, filePath, typeName]);
            return JSON.parse(stdout);
        }
        catch (error) {
            console.error(error);
            return null;
        }
    });
}
