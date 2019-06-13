import Koa, { Context } from "koa";
import bodyParser from "koa-bodyparser";
import rpcActions, { isAction } from "./rpc";

main();
async function main() {
  const port = 8080;
  const koa = new Koa();

  koa.use(bodyParser());
  koa.use(errorMiddleware);
  koa.use(rpcMiddleware);

  koa.listen(port, () => console.log(`Listening on port ${port}`));;
}

async function rpcMiddleware(context: Context, next: () => Promise<any>) {
  const { request } = context;

  if (request.method !== "GET" && request.method !== "POST") {
    return next();
  }

  const match = request.path.match(/\/api\/([A-Za-z0-9_-]+)/);
  if (match) {
    const actionName = match[1];
    const rawOptions = request.body;
    if(!isAction(actionName)) {
      throw new Error(`Action not found "${actionName}"`);
    }
    const actionFn = rpcActions[actionName];
    context.body = await actionFn(rawOptions, context);
    context.status = 200;
  }

  return next();
}

async function errorMiddleware(context: Context, next: () => Promise<any>) {
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
}
