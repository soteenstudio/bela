import { Type, Code, BELAMessage } from "./belaMessage";

export function getFullEnv(key: string): string {
  const maxRetries: number = 5;
  for (let i = 0; i < maxRetries; i++) {
    if (key && key?.length === 32) {
      return key;
    }
  }
  throw BELAMessage.say({
    type: Type.ERROR,
    code: Code.GENERAL_NOT_FULFILLED,
    name: "BELA",
    message: `Password length must be 32, but got ${key?.length}.`
  });
}