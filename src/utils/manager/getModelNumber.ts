export function getModelNumber(filename: string, modelName: string): string | null {
    const regex = new RegExp(`^${modelName}-(\\d+)\\.belamodel$`);
    const match = filename.match(regex);
    
    return match ? match[1].padStart(3, "0") : null;
}