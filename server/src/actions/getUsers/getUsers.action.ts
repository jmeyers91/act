type Result = Array<{
  id: number;
  name: string;
}>;

export default async function getUsers(): Promise<Result> {
  return [
    {
      id: 1,
      name: "user"
    }
  ];
}
