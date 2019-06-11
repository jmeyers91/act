export interface PackageJSON {
    name: string;
    version: string;
    dependencies: {
        [key: string]: string;
    };
    devDependencies: {
        [key: string]: string;
    };
}
declare const packageJSON: PackageJSON;
export default packageJSON;
