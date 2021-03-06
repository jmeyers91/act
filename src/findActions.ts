import path from 'path';
import { readFileSync } from 'fs';
import globby from 'globby';
import execa from 'execa';
import * as j2t from 'json-schema-to-typescript';
import Action, { ActionSchema } from './Action';
import capitalizeStart from './utils/capitalizeStart';

/**
 * Finds and resolves all action modules in a project.
 * @param projectRoot The project root directory.
 */
export default async function findActions(
  projectRoot: string
): Promise<Action[]> {
  const actionFiles = await globby('**/*.action.ts', {
    cwd: projectRoot,
    ignore: ['node_modules']
  });
  console.log('Found action files');
  console.log(actionFiles.join('\n'));
  const actions = await Promise.all(
    actionFiles.map(relativePath =>
      resolveAction(path.join(projectRoot, relativePath))
    )
  );

  return actions;
}

/**
 * Resolves an action module.
 * @param filePath The full path to the action file.
 */
async function resolveAction(filePath: string): Promise<Action> {
  const actionName = path.parse(filePath).name.replace(/\.action/, '');
  console.time(actionName);
  const endpoint = `/api/${actionName}`;
  const validateResult = true;
  const optionsInterfaceName = `${capitalizeStart(actionName)}Options`;
  const resultInterfaceName = `${capitalizeStart(actionName)}Result`;
  const [optionsSchema, resultSchema] = await Promise.all([
    getSchema(filePath, 'Options'),
    getSchema(filePath, 'Result')
  ]);
  const optionsSchemaString = optionsSchema
    ? JSON.stringify(optionsSchema, null, 2)
    : null;
  const resultSchemaString = resultSchema ? JSON.stringify(resultSchema, null, 2) : null;
  const hasOptions = !!optionsSchema;
  const hasResult = !!resultSchema;
  const optionsInterface = optionsSchema
    ? await j2t.compile(optionsSchema, optionsInterfaceName, {
        bannerComment: ''
      })
    : null;

  const resultInterface = resultSchema
    ? await j2t.compile(resultSchema, resultInterfaceName, {
        bannerComment: ''
      })
    : null;

  console.timeEnd(actionName);
  return {
    actionName,
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
): Promise<ActionSchema | null> {
  const options = [
    '--defaultProps',
    '--strictNullChecks',
    '--required',
    '--noExtraProps',
    '--ignoreErrors'
  ];
  const contents = readFileSync(filePath, 'utf8');
  if (
    !contents.includes(`type ${typeName}`) &&
    !contents.includes(`interface ${typeName}`) &&
    !contents.includes(`class ${typeName}`)
  ) {
    return null;
  }
  try {
    const { stdout } = await execa('typescript-json-schema', [
      ...options,
      filePath,
      typeName
    ]);
    return JSON.parse(stdout);
  } catch (error) {
    console.error(error);
    return null;
  }
}
