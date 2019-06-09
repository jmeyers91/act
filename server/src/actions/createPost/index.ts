import run from './createPost.action';
import optionsSchema from './createPost.options.json';
import resultSchema from './createPost.result.json';
import Action from '../../Action';

const action: Action<any, any> = {
  run,
  optionsSchema,
  resultSchema,
  name: 'createPost'
};

export default action;
