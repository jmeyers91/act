import path from "path";
import { readFileSync } from "fs";
import globby from "globby";
import execa from "execa";
import * as j2t from "json-schema-to-typescript";
import ActionModule, { Schema } from "./ActionModule";
import properCase from "./utils/properCase";

/**
 * Finds and resolves all action modules in a project.
 * @param projectRoot The project root directory.
 */
export default async function findActionModules(
  projectRoot: string
): Promise<ActionModule[]> {
  const srcPath = path.join(projectRoot, "src");
  const actionFiles = await globby("**/*.action.ts", { cwd: srcPath });
  return Promise.all(
    actionFiles
      .map(relativePath => path.join(srcPath, relativePath))
      .map(resolveAction)
  );
}

/**
 * Resolves an action module.
 * @param filePath The full path to the action file.
 */
async function resolveAction(filePath: string): Promise<ActionModule> {
  const actionName = path.parse(filePath).name.replace(/\.action/, "");
  const importPath = filePath.replace(/\.ts$/, '');
  const endpoint = `/api/${actionName}`;
  const validateResult = true;
  const optionsInterfaceName = `${properCase(actionName)}Options`;
  const resultInterfaceName = `${properCase(actionName)}Result`;
  const [optionsSchema, resultSchema] = await Promise.all([
    getSchema(filePath, "Options"),
    getSchema(filePath, "Result")
  ]);
  const optionsSchemaString = optionsSchema ? JSON.stringify(optionsSchema) : null;
  const resultSchemaString = resultSchema ? JSON.stringify(resultSchema) : null;
  const hasOptions = !!optionsSchema;
  const hasResult = !!resultSchema;
  const [optionsInterface, resultInterface] = await Promise.all(
    [
      optionsSchema &&
        j2t.compile(optionsSchema, optionsInterfaceName, { bannerComment: "" }),
      resultSchema &&
        j2t.compile(resultSchema, resultInterfaceName, { bannerComment: "" })
    ].filter((v: any): v is Promise<any> => !!v)
  );

  return {
    actionName,
    importPath,
    endpoint,
    filePath,
    optionsSchema,
    resultSchema,
    optionsSchemaString,
    resultSchemaString,
    optionsInterface,
    resultInterface,
    optionsInterfaceName,
    resultInterfaceName,
    hasOptions,
    hasResult,
    validateResult
  };
}

/**
 * Searches the file at `filePath` for the type `typeName` and returns it as a JSON schema object.
 * Returns `null` if the type or file aren't found.
 * @param filePath The Typescript file to search.
 * @param typeName The type to turn into a schema.
 */
async function getSchema(
  filePath: string,
  typeName: string
): Promise<Schema | null> {
  const options = ["--defaultProps", "--strictNullChecks", "--required", "--noExtraProps"];
  const binPath = path.resolve(
    __dirname,
    "..",
    "node_modules",
    ".bin",
    "typescript-json-schema"
  );
  const contents = readFileSync(filePath, "utf8");
  if (
    !contents.includes(`type ${typeName}`) &&
    !contents.includes(`interface ${typeName}`) &&
    !contents.includes(`class ${typeName}`)
  ) {
    return null;
  }
  try {
    const { stdout } = await execa(binPath, [...options, filePath, typeName]);
    return JSON.parse(stdout);
  } catch (error) {
    console.error(error);
    return null;
  }
}
