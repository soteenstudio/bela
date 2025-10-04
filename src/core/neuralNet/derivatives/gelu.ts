/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
export function gelu(x: number): number {
  const c = Math.sqrt(2 / Math.PI);
  const tanhArg = c * (x + 0.044715 * Math.pow(x, 3));
  const tanhDeriv = 1 - Math.pow(Math.tanh(tanhArg), 2);
  const secondTerm = x * c * (1 + 3 * 0.044715 * Math.pow(x, 2)) * tanhDeriv;
  return 0.5 * (1 + Math.tanh(tanhArg)) + 0.5 * secondTerm; 
}