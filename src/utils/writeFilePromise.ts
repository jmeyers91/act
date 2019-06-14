import { writeFile } from 'fs';

/**
 * `fs.writeFile` wrapped in a promise.
 */
export default function writeFilePromise(
  filePath: string,
  content: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    writeFile(filePath, content, error => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
