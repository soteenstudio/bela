export const SPECIAL_TOKENS = {
  unk: "<unk>",
  bos: "<bos>",
  eos: "<eos>",
  user: "<user>",
  bot: "<bot>",
  newline: "<newline>"
}
export const specials = Object.values(SPECIAL_TOKENS);
export let vocabMap: Map<string, number> = new Map();
export let unkTokenId: number = -1;

export function setVocab(vocab: string[]) {
  vocabMap.clear();
  vocab.forEach((word, idx) => {
    vocabMap.set(word, idx);
    if (word === SPECIAL_TOKENS.unk) {
      unkTokenId = idx;
    }
  });
}