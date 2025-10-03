export function softmax(scores: number[]): number[] {
  const maxScore = Math.max(...scores); // stabilisasi numerik
  const exps = scores.map(s => Math.exp(s - maxScore));
  const sumExp = exps.reduce((a, b) => a + b, 0);
  return exps.map(e => e / sumExp);
}