import { Parameter } from './Parameter';
import { LearnedPatternValue } from './LearnedPatternValue';
import { BinaryPatternValue } from './BinaryPatternValue';

export interface ModelData {
  parameters: Parameter;
  learnedPatterns: [string, LearnedPatternValue][]
  binaryPatterns: [string, BinaryPatternValue][];
  frequentPatterns: string[];
}