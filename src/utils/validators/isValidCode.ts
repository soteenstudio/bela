import * as utils from "../";

export function isValidCode(code: string): boolean {
  if (code.length !== 16) return false;

  const raw = code.slice(0, 12);
  const expectedChecksum = utils.generateChecksum(raw);
  const actualChecksum = code.slice(12);

  return expectedChecksum === actualChecksum;
}