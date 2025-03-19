import * as fs from 'fs';
import * as path from 'path';
import * as utils from "./";

export function incrementBelamodel(
    dirPath: string,
    modelName: string,
    newData: ModelData,
    key: string
  ): string {
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

    if (latestFile) {
        const latestFilePath = path.join(dirPath, latestFile);
        const latestData = utils.unlock(fs.readFileSync(latestFilePath, 'utf-8'), key);

        if (JSON.stringify(latestData) === JSON.stringify(newData)) {
            return latestFile;
        }
    }

    let newNumber = String(maxNumber + 1).padStart(3, "0");
    return `${modelName}-${newNumber}.belamodel`;
}