import { isStringArray } from "../../validators/isStringArray";
import { tokenToWord } from "./tokenToWord";
import { binaryToWord } from "./binaryToWord";

export function detokenize(
  tokens: string[]
): string {
  if (isStringArray(tokens)) {
    let words: string[] = [];
    let currentWord = "";
  
    for (let token of tokens) {
      const wordPiece = tokenToWord(binaryToWord(token));
  
      if (wordPiece.startsWith("▁")) {
        // Kalau token diawali "▁", berarti mulai kata baru
        if (currentWord.length > 0) {
          words.push(currentWord);
        }
        currentWord = " " + wordPiece.slice(1); // hapus simbol ▁
      } else {
        currentWord += wordPiece;
      }
    }
  
    if (currentWord.length > 0) {
      words.push(currentWord);
    }
  
    return words.join(" ");
  } else {
    return "<unk>";
  }
}