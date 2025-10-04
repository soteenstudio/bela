/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
import * as fs from 'fs';
import * as path from 'path';

export function deleteBelamodel(dirPath: string, modelName: string, maxFiles: number): string | null {
    const files = fs.readdirSync(dirPath);
    const regex: RegExp = new RegExp(`^${modelName}-(\\d+)\\.belamodel$`);
    
    let fileNumbers: number[] = [];

    files.forEach(file => {
        let match = file.match(regex);
        if (match) {
            fileNumbers.push(Number(match[1]));
        }
    });

    if (fileNumbers.length > maxFiles) {
        let minNumber = Math.min(...fileNumbers);
        return `${modelName}-${String(minNumber).padStart(3, "0")}.belamodel`;
    }

    return null;
}