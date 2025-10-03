export function wordToBinary(text: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  
  const binary = Array.from(bytes)
    .map(byte => byte.toString(2).padStart(8, '0'))
    .join('');
  
  return binary;
}