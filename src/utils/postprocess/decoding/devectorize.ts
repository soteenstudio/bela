export function devectorize(vector: number[]): string {
  const sliced = vector.length > 128
    ? vector.slice(0, 128)
    : [...Array(128 - vector.length).fill(0), ...vector]; // padding di depan

  return sliced.map(bit => (bit === 1 ? "1" : "0")).join("");
}