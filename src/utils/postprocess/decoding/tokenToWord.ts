import { vocabMap, unkTokenId } from "../../data/vocab/setVocab";

export function tokenToWord(token: string): string {
  const id = parseInt(token);
  for (const [word, idx] of vocabMap.entries()) {
    if (idx === id) {
      return word;
    }
  }
  if (unkTokenId !== -1) {
    // Kalo id gak ketemu, balikin "<unk>"
    return "<unk>";
  }
  throw new Error(`Unknown token id: ${token}`);
}