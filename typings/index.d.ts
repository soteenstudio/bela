/** Typing for index.ts **/
import Configuration from "./Configuration";
import ConversationDataset from "./ConversationDataset";
import ImageDataset from "./ImageDataset";
import PredictTextOption from "./PredictTextOption";
import PredictImageOption from "./PredictImageOption";
import SaveOption from "./SaveOption";
import LoadOption from "./LoadOption";
import FromOption from "./FromOption";
import ToOption from "./ToOption";
import ReadOption from "./ReadOption";

declare class BELA {
  constructor(config: Configuration = {}) {}
  
  train(dataset: (ConversationDataset | ImageDataset)[]): void {}
  fineTune(dataset: (ConversationDataset | ImageDataset)[]): void {}
  predict(prompt: string, options: PredictOption): string {}
  save(name: string, options: SaveOption): void {}
  load(name: string, options: LoadOption): void {}
  move(from: string, fromOptions: FromOption, to: string, toOptions: ToOption): void {}
  read(name: string, options: ReadOption): ModelData {}
}
export = BELA;
export { BELA };