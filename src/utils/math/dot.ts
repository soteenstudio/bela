/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
export function dot(a: number[], b: number[]): number {
  if (a.length !== b.length) throw new Error("Vector length mismatch");
  return a.reduce((sum, val, i) => sum + val * b[i], 0);
}