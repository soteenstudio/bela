export function base64(text: string): string {
  return Buffer.from(text).toString('base64');
}