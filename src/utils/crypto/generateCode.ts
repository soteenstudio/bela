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

export async function generateCode(chars: string): Promise<string> {
  const digest = await utils.streamHash(chars); // setelah semua chunk diupdate
  let raw = '';

  for (let i = 0; i < 12; i++) {
    const index = digest[i] % chars.length;
    raw += chars.charAt(index);
  }

  const checksum = utils.generateChecksum(raw);
  return raw + checksum;
}