export function calculateHammingDistance(binary1: string, binary2: string): number {
  let minLength = Math.min(binary1.length, binary2.length);
  let distance = Math.abs(binary1.length - binary2.length);

  for (let i = 0; i < minLength; i++) {
    if (binary1[i] !== binary2[i]) distance++;
  }

  return distance;
}