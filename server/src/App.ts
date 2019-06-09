import Koa from "koa";
import bodyParser from "koa-bodyparser";
import { Server as HTTPServer } from "http";
import Ajv from "ajv";
import Action from "./Action";
import { TypeGuardError } from "typescript-is";
export { default as Action } from "./Action";

export interface Options {
  port: number;
}

export default class ActApp {
  public readonly options: Options;
  public readonly webserver: Koa = new Koa();
  public readonly actions: Map<string, Action<any, any>> = new Map();
  private httpServer?: HTTPServer;
  private readonly ajv = new Ajv({ async: true });

  constructor(options: Options) {
    this.options = options;
  }

  public addAction(action: Action<any, any>) {
    const { actions } = this;
    const { name } = action;
    if (actions.has(name)) {
      throw new Error(
        `Failed to add action "${name}". An action with that name has already been added.`
      );
    }
    actions.set(name, action);
  }

  public getAction(actionName: string): Action<any, any> | undefined {
    return this.actions.get(actionName);
  }

  async runAction(actionName: string, rawOptions: unknown): Promise<unknown> {
    const action = this.getAction(actionName);
    if (!action) {
      throw new Error(`Action not found "${actionName}"`);
    }
    const { ajv } = this;
    const { optionsSchema, resultSchema } = action;
    const hasOptions = optionsSchema.type !== null;
    const hasResult = resultSchema.type !== null;
    const options = hasOptions
      ? await ajv.validate({ ...optionsSchema, $async: true }, rawOptions)
      : undefined;
    const rawResult = await action.run(options);
    const result = hasResult
      ? await ajv.validate({ ...resultSchema, $async: true }, rawResult)
      : undefined;
    console.log("Ran", actionName, "with", options, "got", result);
    return result;
  }

  async listen() {
    return new Promise((resolve, reject) => {
      const { options, webserver } = this;

      webserver.use(bodyParser());

      webserver.use(async (context, next) => {
        try {
          await next();
        } catch (error) {
          if (error instanceof TypeGuardError) {
            context.status = 400;
            context.message = error.message;
            context.error = { ...error };
          } else {
            context.status = error.status || 500;
            context.message = error.message;
            context.body = {
              error: { ...error }
            };
          }
        }
      });

      webserver.use(async (context, next) => {
        const { request } = context;

        if (request.method !== "GET" && request.method !== "POST") {
          return next();
        }

        const match = request.path.match(/\/api\/([A-Za-z0-9_-]+)/);
        if (match) {
          const actionName = match[1];
          const rawOptions = request.body;
          context.body = await this.runAction(actionName, rawOptions);
          context.status = 200;
        }

        return next();
      });

      this.httpServer = webserver.listen(options.port, (error?: Error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async stop() {
    return new Promise((resolve, reject) => {
      const { httpServer } = this;
      if (httpServer) {
        httpServer.close(error => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }
}
