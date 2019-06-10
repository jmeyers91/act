export interface CreatePostOptions {
  content?: null | string;
  title: string;
}

export interface CreatePostResult {
  content: string;
  id: number;
  title: string;
}

export async function createPost(options: CreatePostOptions): Promise<CreatePostResult> {
  const response = await fetch('/api/createPost', {
    method: 'POST',
    body: JSON.stringify(options),
    headers: {
      'Content-Type': 'application/json'
    },
  });
  return await response.json();
}

export type GetUsersResult = {
  id: number;
  name: string;
}[];

export async function getUsers(): Promise<GetUsersResult> {
  const response = await fetch('/api/getUsers', {
    method: 'POST',
  });
  return await response.json();
}

export default {
  createPost,
  getUsers,
};
