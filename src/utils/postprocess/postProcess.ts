/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
import { SPECIAL_TOKENS } from "../data/vocab/setVocab";

export function postProcess(modelOutput: string): string {
  let output = modelOutput;

  Object.values(SPECIAL_TOKENS).forEach(token => {
    output = output.replaceAll(token, "");
  });

  output = output.replace(/\s+/g, " ").trim();

  return output;
}