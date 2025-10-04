/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
import * as utils from "../";

export function isValidCode(code: string): boolean {
  if (code.length !== 16) return false;

  const raw = code.slice(0, 12);
  const expectedChecksum = utils.generateChecksum(raw);
  const actualChecksum = code.slice(12);

  return expectedChecksum === actualChecksum;
}