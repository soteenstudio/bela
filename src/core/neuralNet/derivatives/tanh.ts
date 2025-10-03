export function tanh(x: number): number {
  const t = Math.tanh(x);
  return 1 - t * t;
}