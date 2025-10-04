/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
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