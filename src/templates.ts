import { readFileSync } from 'fs';
import path from 'path';
import Handlebars, { TemplateDelegate } from 'handlebars';
import Action from './Action';

const templateRoot = path.resolve(__dirname, '..', 'templates');

export interface ClientTemplateProps {
  actions: Action[];
}
export const clientTemplate = loadTemplate<ClientTemplateProps>('client');

export interface ServerTemplateProps {
  actions: (Action & { importPath: string })[];
}
export const serverTemplate = loadTemplate<ServerTemplateProps>('server');

function loadTemplate<T = any>(name: string): TemplateDelegate<T> {
  const templatePath = path.join(templateRoot, `${name}.hbs`);
  const templateSrc = readFileSync(templatePath, 'utf8');
  return Handlebars.compile(templateSrc);
}
