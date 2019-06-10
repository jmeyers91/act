import Post from "../models/Post.model";

interface Options {
  title: string;
  content: string | null | undefined;
}

type Result = Post;

export default async function createPost(options: Options): Promise<Result> {
  return {
    id: 1,
    title: options.title,
    content: options.content || ""
  };
}
