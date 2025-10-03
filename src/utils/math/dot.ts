export function dot(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new Error("Vector length mismatch");
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}