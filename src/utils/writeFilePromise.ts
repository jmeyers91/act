import { writeFile } from 'fs';

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
