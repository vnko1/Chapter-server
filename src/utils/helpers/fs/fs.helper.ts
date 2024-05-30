import { readdir, unlink } from "fs/promises";
import { join } from "path";

export const getPath = (...path: string[]) => join(...path);

export const deleteFile = async (path: string) => {
  await unlink(path);
};

export const deleteAllFiles = async (path: string, exception = "index.ts") => {
  for (const file of await readdir(path)) {
    if (file.startsWith(exception)) continue;
    await unlink(join(path, file));
  }
};
