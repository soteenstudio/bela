/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
export function wordToBinary(text: string): string {
  const encoder = new TextEncoder();
  const bytes = encoder.encode(text);
  
  const binary = Array.from(bytes)
    .map(byte => byte.toString(2).padStart(8, '0'))
    .join('');
  
  return binary;
}