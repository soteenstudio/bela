import * as crypto from "crypto";

const ALGORITHM = "aes-256-cbc";
const IV = crypto.randomBytes(16);

export function decrypt(encryptedText: string, KEY: string): string {
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