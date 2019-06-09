import { JSONSchema4 } from "json-schema";
export { JSONSchema4 as Schema } from "json-schema";
export default interface ActionModule {
    actionName: string;
    filePath: string;
    hasOptions: boolean;
    hasResult: boolean;
    optionsSchema: JSONSchema4 | null;
    resultSchema: JSONSchema4 | null;
    optionsInterfaceName: string | null;
    resultInterfaceName: string | null;
    optionsInterface: string | null;
    resultInterface: string | null;
}
