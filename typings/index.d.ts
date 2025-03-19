/** Typing for index.ts **/
declare class BELA {
  constructor(config: Configuration = {}) {}
  
  train(dataset: Dataset[]): void {}
  info(options: Option = {}): Parameter | ModelData | object {}
  predict(question: string, maxLength: number): string {}
  save(filename: string, key: string): void {}
  load(filename: string, key: string): void {}
}
export = BELA;
export { BELA };