import { Context } from "koa";
import Post from "../models/Post.model";

type Options = {
  title: string;
  content: string | null | undefined;
} | { foo: string | number | Foo, posts: Post };

enum Foo {
  aaa,
  bar = '3',
  buzz = 'dd'
}

type Result = Post;

export default async function createPost(): Promise<Result> {
  return {
    id: 1,
    title: 'N/A',
    content:  "lorem ipsum"
  };
}
