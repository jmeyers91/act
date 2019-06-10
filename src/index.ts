import path from "path";
import { writeFile } from "fs";
import findActionModules from "./findActionModules";
import { clientTemplate, serverTemplate } from "./templates";
import ActionModule from "./ActionModule";

const rootPath = path.resolve(process.argv[2] || process.cwd());
const serverOutPath =
  process.argv[3] || path.join(rootPath, "src", "act-server.ts");
const clientOutPath =
  process.argv[4] || path.join(rootPath, "src", "act-client.ts");

main();
async function main() {
  console.time("done");
  console.log(`Starting in ${rootPath}`);
  const actions = (await findActionModules(rootPath)).map(action => ({
    ...action,
    importPath: getServerActionImportPath(action)
  }));

  actions.map(action => `  ${action.actionName} - ${action.filePath}`).forEach(s => console.log(s));

  const clientSrc = clientTemplate({
    actions
  });
  const serverSrc = serverTemplate({
    actions
  });

  await Promise.all([
    writeFilePromise(clientOutPath, clientSrc),
    writeFilePromise(serverOutPath, serverSrc)
  ]);
  console.timeEnd("done");
}

function getServerActionImportPath(action: ActionModule) {
  return (
    "./" +
    path
      .relative(path.parse(serverOutPath).dir, action.filePath)
      .replace(/\.ts$/, "")
  );
}

function writeFilePromise(filePath: string, content: string): Promise<void> {
  return new Promise((resolve, reject) => {
    writeFile(filePath, content, error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
