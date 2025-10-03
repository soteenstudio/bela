import { encrypt } from "../crypto/encrypt";
import { generateCode } from "../crypto/generateCode";
import {
  Type,
  Code,
  BELAMessage
} from "../message/belaMessage";

export async function secure(
  json: object,
  password: string,
  modelName?: string,
): Promise<string> {
  let encodedJson: string = encrypt(JSON.stringify(json), password);
  
  const code: string = await generateCode(encodedJson);
  
  try {
    return encodedJson + code;
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