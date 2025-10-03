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