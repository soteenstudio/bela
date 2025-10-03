import * as utils from "../";

export async function generateCode(chars: string): Promise<string> {
  const digest = await utils.streamHash(chars); // setelah semua chunk diupdate
  let raw = '';

  for (let i = 0; i < 12; i++) {
    const index = digest[i] % chars.length;
    raw += chars.charAt(index);
  }

  const checksum = utils.generateChecksum(raw);
  return raw + checksum;
}