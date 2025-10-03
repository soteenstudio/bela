import { SPECIAL_TOKENS } from "../data/vocab/setVocab";

export function preprocessUserText(text: string): string {
  return `${SPECIAL_TOKENS.bos}${SPECIAL_TOKENS.user}${text}${SPECIAL_TOKENS.eos}${SPECIAL_TOKENS.bot}`.trim();
}