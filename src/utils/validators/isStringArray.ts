export function isStringArray(arr: any): boolean {
  return Array.isArray(arr) && arr.every(item => typeof item === 'string');
}