import { JSONSchema4 } from 'json-schema';
export declare type ActionSchema = JSONSchema4;
export default interface ActionModule {
    actionName: string;
    endpoint: string;
    filePath: string;
    hasOptions: boolean;
    hasResult: boolean;
    optionsSchema: ActionSchema | null;
    resultSchema: ActionSchema | null;
    optionsSchemaString: string | null;
    resultSchemaString: string | null;
    optionsInterfaceName: string | null;
    resultInterfaceName: string | null;
    optionsInterface: string | null;
    resultInterface: string | null;
    validateResult: boolean;
}
