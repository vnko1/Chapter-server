import { randomUUID } from 'crypto';
import { join } from 'path';

export const multerConfig = {
  destination: join('src', 'temp'),
  filename: (
    _: unknown,
    file: Express.Multer.File,
    cb: (r: null, s: string) => void,
  ) => {
    const { mimetype } = file;
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    const ext = mimetype.split('/')[1];
    const id = randomUUID();
    const filename = `${randomName}_` + id + '.' + ext;

    cb(null, filename);
  },
};
