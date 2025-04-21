declare interface ModelData {
  metadata?: Metadata;
  parameters: Parameter;
  learnedPatterns: [string, LearnedPatternValue][]
  binaryPatterns: [string, BinaryPatternValue][];
  frequentPatterns: string[];
  reverseNGrams: Record<string, string[]>;
}