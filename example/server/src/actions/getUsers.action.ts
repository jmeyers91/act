import { Context } from 'koa'

type Result = Array<{
  id: number;
  name: string;
}>;

export default async function getUsers(context: Context): Promise<Result> {
  console.log('getUsers', context.request.path);
  return [
    {
      id: 1,
      name: "user"
    }
  ];
}
