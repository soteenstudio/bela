import { SPECIAL_TOKENS } from "../data/vocab/setVocab";

export function postProcess(modelOutput: string): string {
  let output = modelOutput;

  Object.values(SPECIAL_TOKENS).forEach(token => {
    output = output.replaceAll(token, "");
  });

  output = output.replace(/\s+/g, " ").trim();

  return output;
}