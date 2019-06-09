const path = require('path');
const templatePath = p => path.join(__dirname, 'plop-templates', p);

module.exports = plop => {
  plop.setGenerator('action', {
    description: 'Create an action function',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Action name',
      },
    ],
    actions: [
      {
        type: 'add',
        path: 'src/actions/{{camelCase name}}/{{camelCase name}}.action.ts',
        templateFile: templatePath('action.hbs'),
      },
    ],
  });
};
