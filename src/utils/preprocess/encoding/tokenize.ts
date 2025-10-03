import { wordToToken } from "./wordToToken";
import { wordToBinary } from "./wordToBinary";
import { specials } from "../../data/vocab/setVocab";

export function tokenize(
  text: string,
  vocabs: string[],
  maxToken: number
): string[] {
  if (typeof text === "string") {
    const words = text.split(" ");
    const tokens: string[] = [];
  
    for (let word of words) {
      let remaining = word.toLowerCase();
      let token = "▁";
      while (remaining.length > 0) {
        let found = false;
        for (let i = Math.min(remaining.length, maxToken); i > 0; i--) {
          const sub = remaining.slice(0, i);
          if (vocabs.includes(sub)) {
            if (specials.includes(sub)) {
              tokens.push(wordToBinary(wordToToken(sub)));
              break;
            }
            
            const t = token + sub;
            
            tokens.push(wordToBinary(wordToToken(t)));
            remaining = remaining.slice(i);
            token = "";
            found = true;
            break;
          }
        }
        if (!found) {
          const t = token + remaining[0];
          
          tokens.push(wordToBinary(wordToToken(t)));
          remaining = remaining.slice(1);
          token = "";
        }
      }
    }
    
    return tokens;
  } else {
    return ["00000000"];
  }
}