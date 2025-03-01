export function isValidBinary(binary: string, invalidPatterns: Set<string>): boolean {
  return binary.length % 8 === 0 && !invalidPatterns.has(binary);
}