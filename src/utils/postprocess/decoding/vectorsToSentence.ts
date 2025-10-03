import { devectorize } from "./devectorize";

export function vectorsToSentence(vectors: number[][]): string[] {
  return vectors.map(devectorize);
}