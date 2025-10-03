export function isValidBinary(binary: string, /*invalidPatterns: Set<string>*/): boolean {
  console.log(binary);
  return binary.length % 8 === 0;
  //&& !invalidPatterns.has(binary);
}