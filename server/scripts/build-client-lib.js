const { readdir, writeFile, mkdirp, readFileSync } = require("fs-extra");
const path = require("path");
const Handlebars = require("handlebars");
const j2t = require("json-schema-to-typescript");
const del = require("del");

const srcPath = path.resolve(__dirname, "..", "src");
const outPath = path.resolve(__dirname, "..", '..', 'client', 'src', "api");
const actionsPath = path.join(srcPath, "actions");
const actionTemplate = Handlebars.compile(
  readFileSync(path.join(__dirname, "action.hbs"), "utf8")
);
const actionDeclarationTemplate = Handlebars.compile(
  readFileSync(path.join(__dirname, "action-declaration.hbs"), "utf8")
);

main();
async function main() {
  console.log("Building client library");

  // await del(outPath, { force: true });
  await mkdirp(outPath);

  const actions = await readdir(actionsPath);
  const filesToWrite = [];

  await Promise.all(
    actions.map(async actionName => {
      console.time(actionName);
      const actionRootPath = path.join(actionsPath, actionName);
      const actionOptionsPath = path.join(
        actionRootPath,
        `${actionName}.options.json`
      );
      const actionResultPath = path.join(
        actionRootPath,
        `${actionName}.result.json`
      );
      const declarationPath = path.join(outPath, `${actionName}.d.ts`);
      const fnPath = path.join(outPath, `${actionName}.js`);

      const optionsSchema = require(actionOptionsPath);
      const resultsSchema = require(actionResultPath);
      const hasOptions = optionsSchema && optionsSchema.type !== "null";
      const hasResult = resultsSchema && resultsSchema.type !== "null";
      const optionsInterfaceSrc = hasOptions
        ? await j2t.compile(optionsSchema, "Options", { bannerComment: '' })
        : null;
      const resultInterfaceSrc = hasResult
        ? await j2t.compile(
            resultsSchema,
            "Result",
            { bannerComment: '' }
          )
        : null;

      const declarationSrc = actionDeclarationTemplate({
        actionName,
        hasOptions,
        hasResult,
        optionsInterfaceSrc,
        resultInterfaceSrc
      });

      const fnSrc = actionTemplate({
        actionName,
        hasOptions,
        hasResult,
        optionsInterfaceSrc,
        resultInterfaceSrc
      })

      queueFileWrite(declarationPath, declarationSrc);
      queueFileWrite(fnPath, fnSrc);

      console.timeEnd(actionName);
    })
  );

  await Promise.all(
    filesToWrite.map(f => {
      // console.log(`Writing ${f.filePath}`, f.content);
      return writeFile(f.filePath, f.content);
    })
  );

  function queueFileWrite(filePath, content) {
    filesToWrite.push({ filePath, content });
  }
}
