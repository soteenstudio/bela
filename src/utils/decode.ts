import crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const IV = crypto.randomBytes(16);
let KEY: string;

function decrypt(encryptedText: string): string {
  try {
    const [ivHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message);
    }
    return "";
  }
}

function base64(encodedText: string): string {
  return Buffer.from(encodedText, 'base64').toString('utf8');
}

export function decode(encodedText: string, key: string): {
  parameters: {
    epochs: number,
    learningRate: number,
    momentum: number,
    randomness: number,
    nGramOrder: number,
    layers: Array<number>
  },
  learnedPatterns: [string, any][],
  binaryPatterns: [string, any][],
  frequentPatterns: string[]
} {
  KEY = key;
  
  let decoded: string = decrypt(encodedText);
  for (let i = 0; i < 10; i++) {
    decoded = base64(decoded);
  }
  return JSON.parse(decrypt(decoded));
}