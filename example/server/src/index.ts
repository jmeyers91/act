import App from "./App";

main();
async function main() {
  const app = new App({
    port: 8080
  });

  await app.listen();
  console.log(`Listening on port ${app.options.port}`);
}
