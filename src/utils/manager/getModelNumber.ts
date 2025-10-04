/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
export function getModelNumber(filename: string, modelName: string): string | null {
    const regex = new RegExp(`^${modelName}-(\\d+)\\.belamodel$`);
    const match = filename.match(regex);
    
    return match ? match[1].padStart(3, "0") : null;
}