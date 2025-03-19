export function getFullEnv(key: string): string {
  const maxRetries: number = 5;
  for (let i = 0; i < maxRetries; i++) {
    if (key && key?.length === 32) {
      return key;
    }
  }
  throw new Error(`Password length must be 32, but got ${key?.length}.`)
}