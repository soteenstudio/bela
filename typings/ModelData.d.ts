declare interface ModelData {
  parameters: Parameter;
  learnedPatterns: [string, LearnedPatternValue][]
  binaryPatterns: [string, BinaryPatternValue][];
  frequentPatterns: string[];
}