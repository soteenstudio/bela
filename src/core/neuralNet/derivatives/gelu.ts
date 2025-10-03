export function gelu(x: number): number {
  const c = Math.sqrt(2 / Math.PI);
  const tanhArg = c * (x + 0.044715 * Math.pow(x, 3));
  const tanhDeriv = 1 - Math.pow(Math.tanh(tanhArg), 2);
  const secondTerm = x * c * (1 + 3 * 0.044715 * Math.pow(x, 2)) * tanhDeriv;
  return 0.5 * (1 + Math.tanh(tanhArg)) + 0.5 * secondTerm; 
}