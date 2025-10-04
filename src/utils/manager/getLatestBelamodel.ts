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

export function getLatestBelamodel(
    dirPath: string,
    modelName: string
): string | null {
    const files = fs.readdirSync(dirPath);
    const regex: RegExp = new RegExp(`^${modelName}-(\\d+)\\.belamodel$`);
    let maxNumber: number = 0;
    let latestFile: string | null = null;

    files.forEach(file => {
        let match = file.match(regex);
        if (match) {
            let num: number = Number(match[1]);
            if (num > maxNumber) {
                maxNumber = num;
                latestFile = file;
            }
        }
    });

    return latestFile;
}