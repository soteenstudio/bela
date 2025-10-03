export function sigmoid(x: number): number {
  const sig = 1 / (1 + Math.exp(-x));
  return sig * (1 - sig);
}