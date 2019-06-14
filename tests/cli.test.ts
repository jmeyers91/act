import execa from "execa";

const TIMEOUT = 60000;
const env = {NODE_ENV: 'development'};

describe("cli", () => {
  beforeAll(async () => execa("npm", ["run", "build-example"]), TIMEOUT);

  test("Should compile example server successfully", async () => {
    await execa("npm", ["run", "build-example-server"], { env });
  }, TIMEOUT);

  test('Should compile example client successfully', async () => {
    await execa("npm", ["run", "build-example-client"], { env });
  }, TIMEOUT);
});
