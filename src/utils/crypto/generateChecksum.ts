export function generateChecksum(input: string): string {
  // Simple hash pakai charCode * index, lalu ambil 4 digit terakhir
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    sum += input.charCodeAt(i) * (i + 1);
  }
  const hash = sum.toString().padStart(4, '0').slice(-4); // Ambil 4 digit terakhir
  return hash;
}