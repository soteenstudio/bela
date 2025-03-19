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