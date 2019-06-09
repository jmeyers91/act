const execa = require("execa");
const { readdir, writeFile } = require("fs-extra");
const path = require("path");

const srcPath = path.resolve(__dirname, "..", "src");
const actionsPath = path.join(srcPath, "actions");
const defaultSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "null"
};

main();
async function main() {
  console.log("Building action schemas");
  const actions = await readdir(actionsPath);
  const filesToWrite = [];

  await Promise.all(
    actions.map(async action => {
      console.time(action);
      const actionRootPath = path.join(actionsPath, action);
      const actionFnPath = path.join(actionRootPath, `${action}.action.ts`);
      const actionOptionsPath = path.join(
        actionRootPath,
        `${action}.options.json`
      );
      const actionResultPath = path.join(
        actionRootPath,
        `${action}.result.json`
      );
      const actionIndexPath = path.join(actionRootPath, "index.ts");

      const [optionsSchema, resultSchema] = await Promise.all([
        getSchema(actionFnPath, "Options"),
        getSchema(actionFnPath, "Result")
      ]);

      queueFileWrite(
        actionOptionsPath,
        JSON.stringify(optionsSchema || defaultSchema, null, 2)
      );

      queueFileWrite(
        actionResultPath,
        JSON.stringify(resultSchema || defaultSchema, null, 2)
      );

      queueFileWrite(
        actionIndexPath,
        [
          `import run from './${action}.action';`,
          `import optionsSchema from './${action}.options.json';`,
          `import resultSchema from './${action}.result.json';`,
          `import Action from '../../Action';`,
          "",
          `const action: Action<any, any> = {`,
          "  run,",
          "  optionsSchema,",
          "  resultSchema,",
          `  name: '${action}'`,
          "};",
          "",
          `export default action;`,
          ""
        ].join("\n")
      );
      console.timeEnd(action);
    })
  );

  await Promise.all(filesToWrite.map(f => writeFile(f.filePath, f.content)));

  function queueFileWrite(filePath, content) {
    filesToWrite.push({ filePath, content });
  }
}

async function getSchema(file, typeName) {
  const options = ["--defaultProps", "--strictNullChecks", "--required"];
  try {
    const { stdout } = await execa("typescript-json-schema", [
      ...options,
      file,
      typeName
    ]);
    return JSON.parse(stdout);
  } catch {
    return null;
  }
}
