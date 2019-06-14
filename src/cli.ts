#!/usr/bin/env node
import commander from 'commander';
import packageJSON from './package';
import findActions from './findActions';
import compileServer from './compileServer';
import compileClient from './compileClient';
import writeFilePromise from './utils/writeFilePromise';

commander
  .version(packageJSON.version, '-v, --version')
  .option('-r,--root <path>', 'Project root directory.', process.cwd())
  .option(
    '-c,--client-out <path>',
    'File path used to write the client library.'
  )
  .option(
    '-s,--server-out <path>',
    'File path used to write the server library.'
  )
  .parse(process.argv);

const { root, clientOut, serverOut } = commander;

main();
async function main() {
  if (!serverOut && !clientOut) {
    console.log(
      `You must provide either a server or client out path with --server-out or --client-out.`
    );
    commander.outputHelp();
    process.exit(1);
  }

  console.time('done');
  console.log(`Discovering actions in ${root}`);
  const actions = await findActions(root);

  if (actions.length === 0) {
    console.log(`No actions found in "${root}".`);
    process.exit(1);
  }

  const clientSrc: string | null = clientOut ? compileClient(actions) : null;

  const serverSrc: string | null = serverOut
    ? compileServer(actions, serverOut)
    : null;

  const writePromises: Promise<any>[] = [];

  if (clientSrc) {
    writePromises.push(writeFilePromise(clientOut, clientSrc));
  }

  if (serverSrc) {
    writePromises.push(writeFilePromise(serverOut, serverSrc));
  }

  await Promise.all(writePromises);
  console.timeEnd('done');
}
