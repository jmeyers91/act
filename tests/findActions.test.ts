import path from "path";
import findActions from "../src/findActions";
import Action from "../src/Action";

describe("findActions", () => {
  const examplePath = path.resolve(__dirname, "..", "example", "server");
  let exampleActions: Action[];

  beforeAll(async () => {
    exampleActions = await findActions(examplePath);
  });

  test("Should parse action names correctly", async () => {
    expect(exampleActions.map(action => action.actionName)).toEqual([
      "createPost",
      "getUsers"
    ]);
  });

  test("File paths should be correct", async () => {
    expect(getAction("createPost").filePath).toEqual(
      path.join(examplePath, "src", "actions", "createPost.action.ts")
    );
    expect(getAction("getUsers").filePath).toEqual(
      path.join(examplePath, "src", "actions", "getUsers.action.ts")
    );
  });

  test("hasOptions should be correct", async () => {
    expect(getAction("createPost").hasOptions).toEqual(true);
    expect(getAction("getUsers").hasOptions).toEqual(false);
  });

  test("hasResult should be correct", async () => {
    expect(getAction("createPost").hasResult).toEqual(true);
    expect(getAction("getUsers").hasResult).toEqual(true);
  });

  test("Option schema should match hasOptions", async () => {
    expect(getAction("createPost").optionsSchema).toBeTruthy();
    expect(getAction("getUsers").optionsSchema).toBeFalsy();
  });

  test("Result schema should match hasResult", async () => {
    expect(getAction("createPost").resultSchema).toBeTruthy();
    expect(getAction("getUsers").resultSchema).toBeTruthy();
  });

  test("Option interface should match hasOptions", async () => {
    expect(getAction("createPost").optionsInterface).toBeTruthy();
    expect(getAction("getUsers").optionsInterface).toBeFalsy();
  });

  test("Result interface should match hasResult", async () => {
    expect(getAction("createPost").resultInterface).toBeTruthy();
    expect(getAction("getUsers").resultInterface).toBeTruthy();
  });

  function getAction(name: string): Action {
    const action = exampleActions.find(action => action.actionName === name);
    if (!action) throw new Error(`Action "${name}" not found.`);
    return action;
  }
});
