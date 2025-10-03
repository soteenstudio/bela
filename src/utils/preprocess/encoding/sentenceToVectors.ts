import { vectorize } from "./vectorize";

export function sentenceToVectors(binaryTokens: string[]): number[][] {
  return binaryTokens.map(vectorize);
}