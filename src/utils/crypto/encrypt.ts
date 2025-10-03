import * as crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const IV = crypto.randomBytes(16);

export function encrypt(text: string, KEY: string): string {
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, IV);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${IV.toString("hex")}:${encrypted}`;
}