import Action from './Action';
/**
 * Finds and resolves all action modules in a project.
 * @param projectRoot The project root directory.
 */
export default function findActions(projectRoot: string): Promise<Action[]>;
