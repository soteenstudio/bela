/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
export function isValidBinary(binary: string, /*invalidPatterns: Set<string>*/): boolean {
  console.log(binary);
  return binary.length % 8 === 0;
  //&& !invalidPatterns.has(binary);
}