export const isImageDataset = (
  dataset: (ConversationDataset | ImageDataset)[],
): dataset is ImageDataset[] =>
  typeof dataset[0] === "object" &&
  dataset[0] !== null &&
  "title" in dataset[0] && 
  "image" in dataset[0];