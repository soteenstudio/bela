import crypto from "crypto";

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

export function lock(json: object, key: string): string {
  KEY = key;
  
  let encoded: string = encrypt(JSON.stringify(json));
  for (let i = 0; i < 10; i++) {
    encoded = base64(encoded);
  }
  return encrypt(encoded);
}