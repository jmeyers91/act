import Handlebars from 'handlebars';
import ActionModule from './ActionModule';
export interface ClientTemplateProps {
    actions: ActionModule[];
}
export declare const clientTemplate: Handlebars.TemplateDelegate<ClientTemplateProps>;
export interface ServerTemplateProps {
    actions: (ActionModule & {
        importPath: string;
    })[];
}
export declare const serverTemplate: Handlebars.TemplateDelegate<ServerTemplateProps>;
