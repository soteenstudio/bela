import { SPECIAL_TOKENS } from "../data/vocab/setVocab";

export function preprocessDataset(dataset: ConversationDataset[]): string[] {
  return dataset.map(({ input, output }) => {
    return (
      `${SPECIAL_TOKENS.bos} ${SPECIAL_TOKENS.user} ${input} ${SPECIAL_TOKENS.eos} ` +
      `${SPECIAL_TOKENS.bot} ${output} ${SPECIAL_TOKENS.eos}`
    ).trim();
  });
}