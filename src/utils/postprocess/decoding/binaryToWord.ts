export function binaryToWord(binary: string): string {
  if (binary.length % 8 !== 0) {
    throw new Error('Binary length must be multiple of 8');
  }

  const bytes = [];
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    bytes.push(parseInt(byte, 2));
  }

  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(bytes));
}