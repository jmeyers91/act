import Action from './Action';
import { clientTemplate } from './templates';

export default function compileClient(actions: Action[]): string {
  return clientTemplate({ actions });
}
