export function calculateEntropy(pattern: Map<string, number>, total: number): number {
  let entropy: number = 0;
  pattern.forEach(count => {
    const probability: number = count / total;
    entropy -= probability * Math.log2(probability);
  });
  return entropy;
}