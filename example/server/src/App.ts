import Koa, { Context } from "koa";
import bodyParser from "koa-bodyparser";
import { Server as HTTPServer } from "http";
import rpcActions from "./rpc";

export { default as Action } from "./Action";

export interface Options {
  port: number;
}

export default class ActApp {
  public readonly options: Options;
  public readonly webserver: Koa = new Koa();
  private httpServer?: HTTPServer;

  constructor(options: Options) {
    this.options = options;
  }

  async runAction(context: Context, actionName: string, rawOptions: unknown): Promise<unknown> {
    if(!isValidAction(actionName)) {
      throw new Error(`Action not found "${actionName}"`);
    }
    console.log(actionName, rawOptions);
    return await rpcActions[actionName](rawOptions, context);
  }

  async listen() {
    return new Promise((resolve, reject) => {
      const { options, webserver } = this;

      webserver.use(bodyParser());

      webserver.use(async (context, next) => {
        try {
          await next();
        } catch (error) {
          context.status = error.status || 500;
          context.message = error.message;
          context.body = {
            error: { ...error }
          };
        }
        const { request, response } = context;
        console.log(request.method, request.path, response.status, response.message);
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
          context.body = await this.runAction(context, actionName, rawOptions);
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

function isValidAction(actionName: string): actionName is keyof typeof rpcActions {
  return rpcActions.hasOwnProperty(actionName);
}
