import { dirname } from 'path';

export default function createFsManager({ fs }) {
  return {
    async createObjectWriteStream(path) {
      const dir = dirname(path);
      await fs.mkdirp(dir);
      return fs.createWriteStream(path);
    },
  };
}
