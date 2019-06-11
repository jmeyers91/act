import path from 'path';
import { readFileSync } from 'fs';

const packageJSONPath = path.resolve(__dirname, '..', 'package.json');
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

const packageJSON: PackageJSON = JSON.parse(
  readFileSync(packageJSONPath, 'utf8')
);

export default packageJSON;
