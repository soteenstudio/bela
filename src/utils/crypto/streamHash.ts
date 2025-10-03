import * as crypto from "crypto";
import { Readable } from 'stream';

export function streamHash(chars: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = Readable.from([chars]); // ubah string jadi stream

    stream.on('data', (chunk) => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest()));
    stream.on('error', (err) => reject(err));
  });
}