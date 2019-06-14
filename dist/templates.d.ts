import Handlebars from 'handlebars';
import Action from './Action';
export interface ClientTemplateProps {
    actions: Action[];
}
export declare const clientTemplate: Handlebars.TemplateDelegate<ClientTemplateProps>;
export interface ServerTemplateProps {
    actions: (Action & {
        importPath: string;
    })[];
}
export declare const serverTemplate: Handlebars.TemplateDelegate<ServerTemplateProps>;
