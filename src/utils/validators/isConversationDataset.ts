export const isConversationDataset = (
  dataset: (ConversationDataset | ImageDataset)[],
): dataset is ConversationDataset[] =>
  typeof dataset[0] === "object" &&
  dataset[0] !== null &&
  "input" in dataset[0] && 
  "output" in dataset[0];