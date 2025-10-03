import { vocabMap, unkTokenId } from "../../data/vocab/setVocab";

export function wordToToken(word: string): string {
  if (!vocabMap.has(word)) {
    if (unkTokenId === -1) {
      console.log(vocabMap);
      throw new Error(`Unknown token: ${word} (no <unk> token set)`);
    }
    return String(unkTokenId);
  }
  return String(vocabMap.get(word)!);
}