/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
export function binaryToWord(binary: string): string {
  if (binary.length % 8 !== 0) {
    throw new Error('Binary length must be multiple of 8');
  }

  const bytes = [];
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    bytes.push(parseInt(byte, 2));
  }

  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(bytes));
}