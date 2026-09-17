import { openSync, fstatSync, readSync, closeSync, constants } from 'node:fs';

export const MAX_ATLAS_BYTES = 500_000;

/** Check and consume the same open file; growth cannot bypass the byte budget. */
export function readAtlasJson(path) {
  const fd = openSync(path, constants.O_RDONLY | constants.O_NONBLOCK);
  try {
    const stat = fstatSync(fd);
    if (!stat.isFile() || stat.size > MAX_ATLAS_BYTES) throw new Error('Fichier atlas refusé');
    const buffer = Buffer.alloc(MAX_ATLAS_BYTES + 1);
    let length = 0;
    while (length < buffer.length) {
      const count = readSync(fd, buffer, length, buffer.length - length, null);
      if (count === 0) break;
      length += count;
    }
    if (length > MAX_ATLAS_BYTES) throw new Error('Taille excessive');
    return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(buffer.subarray(0, length)));
  } finally {
    closeSync(fd);
  }
}
