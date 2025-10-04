/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
export function generateChecksum(input: string): string {
  // Simple hash pakai charCode * index, lalu ambil 4 digit terakhir
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    sum += input.charCodeAt(i) * (i + 1);
  }
  const hash = sum.toString().padStart(4, '0').slice(-4); // Ambil 4 digit terakhir
  return hash;
}