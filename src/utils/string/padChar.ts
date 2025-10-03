export function padChar(text: string): string {
  const targetLength = 32;

  const slicedText = text.slice(0, targetLength);
  return slicedText.padEnd(targetLength, '0');
}