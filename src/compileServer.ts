import path from 'path';
import Action from './Action';
import { serverTemplate } from './templates';

export default function compileServer(actions: Action[], outPath: string) {
  const actionsWithImportPaths = actions.map(action => ({
    ...action,
    importPath: getServerActionImportPath(outPath, action)
  }));

  return serverTemplate({
    actions: actionsWithImportPaths
  });
}

function getServerActionImportPath(outPath: string, action: Action) {
  return (
    './' +
    path.relative(path.parse(outPath).dir, action.filePath).replace(/\.ts$/, '')
  );
}
