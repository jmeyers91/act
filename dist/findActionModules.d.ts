import ActionModule from './ActionModule';
/**
 * Finds and resolves all action modules in a project.
 * @param projectRoot The project root directory.
 */
export default function findActionModules(projectRoot: string): Promise<ActionModule[]>;
