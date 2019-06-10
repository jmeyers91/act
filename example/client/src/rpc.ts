import axios from 'axios';
import Ajv from 'ajv';

const ajv = new Ajv();

export interface CreatePostOptions {
  content?: null | string;
  title: string;
}

export interface CreatePostResult {
  content: string;
  id: number;
  title: string;
}

const createPostOptionsSchema = {"$schema":"http://json-schema.org/draft-07/schema#","additionalProperties":false,"defaultProperties":[],"properties":{"content":{"type":["null","string"]},"title":{"type":"string"}},"required":["title"],"type":"object"};
const createPostOptionsValidate = ajv.compile({ ...createPostOptionsSchema, $async: true });
const createPostResultSchema = {"$schema":"http://json-schema.org/draft-07/schema#","additionalProperties":false,"defaultProperties":[],"properties":{"content":{"type":"string"},"id":{"type":"number"},"title":{"type":"string"}},"required":["content","id","title"],"type":"object"};
const createPostResultValidate = ajv.compile({ ...createPostResultSchema, $async: true });
export async function createPost(rawOptions: CreatePostOptions): Promise<CreatePostResult> {
  const options = await createPostOptionsValidate(rawOptions);
  const response = await axios.post('/api/createPost', options);
  return await createPostResultValidate(response.data);
}

export type GetUsersResult = {
  id: number;
  name: string;
}[];

const getUsersResultSchema = {"$schema":"http://json-schema.org/draft-07/schema#","items":{"additionalProperties":false,"defaultProperties":[],"properties":{"id":{"type":"number"},"name":{"type":"string"}},"required":["id","name"],"type":"object"},"type":"array"};
const getUsersResultValidate = ajv.compile({ ...getUsersResultSchema, $async: true });
export async function getUsers(): Promise<GetUsersResult> {
  const response = await axios.post('/api/getUsers');
  return await getUsersResultValidate(response.data);
}

export default {
  createPost,
  getUsers,
};
