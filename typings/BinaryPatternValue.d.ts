declare global {
  interface BinaryPatternValue {
    distribution: { [key: string]: number }; 
    frequency: number; 
    output: string;
  }
}

export {};