import * as utils from './utils/utils';

export class PatternTrainer {
  public nGramPatterns: Map<string, Map<string, number>> = new Map();
  public totalNGrams: Map<string, number> = new Map();
  public learnedPatterns: Map<string, { nextWords: Map<string, number>; totalNextWords: number }> = new Map();
  public binaryPatterns: Map<string, { distribution: { [key: string]: number }; frequency: number; output: string }>;
  public invalidPatterns: Set<string>;
  public frequentPatterns: Set<string>;
  
  constructor(
    private learningRate: number,
    private nGramOrder: number,
    private momentum: number,
    private layers: Array<number>
  ) {
    this.binaryPatterns = new Map();
    this.invalidPatterns = new Set();
    this.frequentPatterns = new Set();
  }
  
  learnSentence(sentence: string): void {
    this.learnNGrams(sentence);
  
    const words = sentence.split(" ");
    for (let i = 0; i < words.length - 1; i++) {
      const word = words[i];
      const nextWord = words[i + 1];
  
      if (!this.learnedPatterns.has(word)) {
        this.learnedPatterns.set(word, { nextWords: new Map(), totalNextWords: 0 });
      }
  
      const pattern = this.learnedPatterns.get(word)!;
  
      const layerFactor = this.layers.length;
      pattern.nextWords.set(nextWord, (pattern.nextWords.get(nextWord) || 0) + this.learningRate * layerFactor);
      pattern.totalNextWords += this.learningRate * layerFactor;
    }
  }
  
  learnNGrams(sentence: string): void {
    const words = sentence.split(" ");
    for (let i = 0; i < words.length - this.nGramOrder; i++) {
        const nGramKey = words.slice(i, i + this.nGramOrder).join(" ");
        const nextWord = words[i + this.nGramOrder];
    
        if (!this.nGramPatterns.has(nGramKey)) {
            this.nGramPatterns.set(nGramKey, new Map());
            this.totalNGrams.set(nGramKey, 0);
        }
    
        const pattern = this.nGramPatterns.get(nGramKey)!;
        pattern.set(nextWord, (pattern.get(nextWord) || 0) + 1);
        this.totalNGrams.set(nGramKey, this.totalNGrams.get(nGramKey)! + 1);
    }
  }
  
  learnBinary(inputBinary: string, outputBinary: string): void {
    if (!utils.isValidBinary(inputBinary, this.invalidPatterns) || !utils.isValidBinary(outputBinary, this.invalidPatterns)) {
      throw new Error("Binary is invalid!");
    }
  
    if (!this.binaryPatterns.has(inputBinary)) {
      this.binaryPatterns.set(inputBinary, {
        distribution: utils.getDistribution(inputBinary),
        frequency: 1,
        output: outputBinary,
      });
    } else {
      const pattern = this.binaryPatterns.get(inputBinary)!;
  
      const layerFactor = this.layers.reduce((sum, neurons) => sum + neurons, 0) / this.layers.length;
      const adjustedMomentum = this.momentum * (1 + layerFactor * 0.001);
  
      if (pattern.frequency && this.learningRate && this.momentum) {
        pattern.frequency = pattern.frequency + (this.learningRate * (1 - adjustedMomentum));
      }
      this.binaryPatterns.set(inputBinary, pattern);
    }
  
    if (this.binaryPatterns.get(inputBinary)!.frequency > 5) {
      this.frequentPatterns.add(inputBinary);
    }
  }
}