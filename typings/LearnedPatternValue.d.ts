declare global {
  interface LearnedPatternValue {
    nextWords: Map<string, number>;
    totalNextWords: number;
  }
}

export {};