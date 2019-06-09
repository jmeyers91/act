import run from './getUsers.action';
import optionsSchema from './getUsers.options.json';
import resultSchema from './getUsers.result.json';
import Action from '../../Action';

const action: Action<any, any> = {
  run,
  optionsSchema,
  resultSchema,
  name: 'getUsers'
};

export default action;
