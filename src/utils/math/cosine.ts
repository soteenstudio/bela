import { dot } from "./dot";

export function cosine(a: number[], b: number[]): number {
  const dotProd = dot(a, b);
  const magA = Math.sqrt(dot(a, a));
  const magB = Math.sqrt(dot(b, b));
  return dotProd / (magA * magB + 1e-8); // buat amanin pembagian nol
}