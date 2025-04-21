import * as crypto from "crypto";
import * as utils from "./"
import { Type, Code, BELAMessage } from "./belaMessage";

const ALGORITHM = "aes-256-cbc";
const IV = crypto.randomBytes(16);
let KEY: string;

function encrypt(text: string): string {
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${IV.toString("hex")}:${encrypted}`;
}

function base64(text: string): string {
  return Buffer.from(text).toString('base64');
}

function generateCode(chars: string): string {
  const hash = crypto.createHash('sha256').update(chars).digest(); // 32 bytes
  let raw = '';

  for (let i = 0; i < 12; i++) {
    const index = hash[i] % chars.length;
    raw += chars.charAt(index);
  }

  const checksum = generateChecksum(raw);
  return raw + checksum;
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

export function lock(
  json: object,
  password: string,
  modelName?: string,
): string {
  KEY = utils.getFullEnv(password);
  
  let encoded: string = encrypt(JSON.stringify(json));
  for (let i = 0; i < 10; i++) {
    encoded = base64(encoded);
  }
  
  const code: string = generateCode(encoded);
  
  try {
    return encrypt(encoded) + code;
  } catch (err) {
    if (modelName) {
      throw BELAMessage.say({
        type: Type.ERROR,
        code: Code.INTERNAL_CORRUPTED_PROBLEM,
        name: "BELA",
        message: `Failed to save model with name _*${modelName}*_.`
      });
    }
    
    return "";
  }
}