/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
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