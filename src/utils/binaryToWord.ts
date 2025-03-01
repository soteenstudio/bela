export function binaryToWord(binary: string): string {
  let word = "";
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    word += String.fromCharCode(parseInt(byte, 2));
  }
  return word;
}