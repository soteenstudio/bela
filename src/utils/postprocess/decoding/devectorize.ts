/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
export function devectorize(vector: number[]): string {
  const sliced = vector.length > 128
    ? vector.slice(0, 128)
    : [...Array(128 - vector.length).fill(0), ...vector]; // padding di depan

  return sliced.map(bit => (bit === 1 ? "1" : "0")).join("");
}