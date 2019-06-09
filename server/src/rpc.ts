import Ajv from 'ajv';
import createPostRaw from '/home/jimmy/projects/act/server/src/actions/createPost/createPost.action';
import getUsersRaw from '/home/jimmy/projects/act/server/src/actions/getUsers/getUsers.action';

const ajv = new Ajv();
type GetOptions <F> = F extends (options: infer G, ...rest: any[]) => any ? G : undefined;

const createPostOptionsSchema = {"$schema":"http://json-schema.org/draft-07/schema#","additionalProperties":false,"defaultProperties":[],"properties":{"content":{"type":["null","string"]},"title":{"type":"string"}},"required":["title"],"type":"object"};
const createPostValidateOptions = ajv.compile({ ...createPostOptionsSchema, $async: true });
const createPostResultSchema = {"$schema":"http://json-schema.org/draft-07/schema#","additionalProperties":false,"defaultProperties":[],"properties":{"content":{"type":"string"},"id":{"type":"number"},"title":{"type":"string"}},"required":["content","id","title"],"type":"object"};
const createPostValidateResult = ajv.compile({ ...createPostResultSchema, $async: true });
export async function createPost(rawOptions: unknown): ReturnType<typeof createPostRaw> {
  const options: GetOptions<typeof createPostRaw> = await createPostValidateOptions(rawOptions);
  const rawResult = await createPostRaw(options);
  return await createPostValidateResult(rawResult);
}

const getUsersResultSchema = {"$schema":"http://json-schema.org/draft-07/schema#","items":{"additionalProperties":false,"defaultProperties":[],"properties":{"id":{"type":"number"},"name":{"type":"string"}},"required":["id","name"],"type":"object"},"type":"array"};
const getUsersValidateResult = ajv.compile({ ...getUsersResultSchema, $async: true });
export async function getUsers(): ReturnType<typeof getUsersRaw> {
  const rawResult = await getUsersRaw();
  return await getUsersValidateResult(rawResult);
}

