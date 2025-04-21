import crypto from "crypto";
import { Type, Code, BELAMessage } from "./belaMessage";
import * as def from "../default";

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
    return "";
  }
}

function base64(encodedText: string): string {
  return Buffer.from(encodedText, 'base64').toString('utf8');
}



function isValid(code: string): boolean {
  if (code.length !== 16) return false;

  const raw = code.slice(0, 12);
  const expectedChecksum = generateChecksum(raw);
  const actualChecksum = code.slice(12);

  return expectedChecksum === actualChecksum;
}

function generateChecksum(input: string): string {
  // Simple hash pakai charCode * index, lalu ambil 4 digit terakhir
  let sum = 0;
  for (let i = 0; i < input.length; i++) {
    sum += input.charCodeAt(i) * (i + 1);
  }
  const hash = sum.toString().padStart(4, '0').slice(-4); // Ambil 4 digit terakhir
  return hash;
}

export function unlock(
  encodedText: string,
  key: string,
  modelName?: string
): ModelData {
  KEY = key;
  
  let decoded: string = decrypt(encodedText);
  for (let i = 0; i < 10; i++) {
    decoded = base64(decoded);
  }
  
  let authenticity: boolean = false;
  try {
    const code = encodedText.slice(-16);
    
    if (isValid(code)) {
      authenticity = true;
      return JSON.parse(decrypt(decoded.replace(code, "")));
    } else {
      authenticity = false;
      throw new Error("");
    }
  } catch (err) {
    if (modelName) {
      throw BELAMessage.say({
        type: Type.ERROR,
        code: Code.INTERNAL_CORRUPTED_PROBLEM,
        name: "BELA",
        message: `Failed to load model with name _*${modelName}*_.`,
        stack: `  • ${authenticity ? "" : "File not authentic."}`
      });
    }
    
    return def.modelData;
  }
}