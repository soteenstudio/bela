/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
import { dot } from "./dot";

export function cosine(a: number[], b: number[]): number {
  const dotProd = dot(a, b);
  const magA = Math.sqrt(dot(a, a));
  const magB = Math.sqrt(dot(b, b));
  return dotProd / (magA * magB + 1e-8); // buat amanin pembagian nol
}