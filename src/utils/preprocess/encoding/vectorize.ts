/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
export function vectorize(binary: string): number[] {
  if (typeof binary === "string") {
    //console.log("bn: ", typeof binary);
    // Biarin string-nya dipotong atau dipadding dulu ke 128 panjangnya
    const padded = binary.length > 128
      ? binary.slice(0, 128)
      : binary.padStart(128, "0"); // padding 0 di depan
  
    return padded.split("").map(bit => (bit === "1" ? 1 : 0));
  }
  return [];
}