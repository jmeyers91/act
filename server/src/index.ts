import App from "./App";
import createPost from "./actions/createPost";
import getUsers from "./actions/getUsers";

main();
async function main() {
  const app = new App({
    port: 8080
  });

  app.addAction(createPost);
  app.addAction(getUsers);

  await app.listen();
  console.log(`Listening on port ${app.options.port}`);
}
