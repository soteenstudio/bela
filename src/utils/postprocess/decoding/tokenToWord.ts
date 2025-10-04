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