import crypto from "crypto"
import { isValidCode } from "../validators/isValidCode";
import { decrypt } from '../crypto/decrypt';
import { Type, Code, BELAMessage } from "../message/belaMessage";
import * as def from "../../default/";

export async function desecure(
  encodedText: string,
  password: string,
  modelName?: string
): Promise<ModelData> {
  let authenticity: boolean = false;
  try {
    const code = encodedText.slice(-16);
    
    if (isValidCode(code)) {
      authenticity = true;
      return JSON.parse(decrypt(encodedText.replace(code, ""), password));
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