import { PatternTrainer } from './PatternTrainer';
import { PatternMatching } from './PatternMatching';
import * as utils from './utils/utils';

export class PatternPredictor {
  constructor(
    private trainer: PatternTrainer,
    private matching: PatternMatching,
    private randomness: number
  ) {}
  
  predictNextWord(word: string): string | null {
    if (Math.random() < this.randomness) {
      const allWords = Array.from(this.trainer.learnedPatterns.keys());
      return allWords.length > 0 ? allWords[Math.floor(Math.random() * allWords.length)] : null;
    }
  
    if (this.trainer.nGramPatterns.has(word)) {
      const pattern = this.trainer.nGramPatterns.get(word)!;
      const total = this.trainer.totalNGrams.get(word)!;
      
      const entropy = utils.calculateEntropy(pattern, total);
      
      console.log(`Entropy for nGramPatterns: ${entropy}`);
      
      let threshold = Math.random() * total;
      for (let [nextWord, count] of pattern.entries()) {
        threshold -= count;
        if (threshold <= 0) return nextWord;
      }
    }
  
    if (this.trainer.learnedPatterns.has(word)) {
      const pattern = this.trainer.learnedPatterns.get(word)!;
      
      if (pattern.nextWords) {
        const wordEntries = Array.from(pattern.nextWords.entries());
      
        if (wordEntries.length === 0) return null;
      
        const totalWeight = wordEntries.reduce((sum, [, freq]) => sum + Math.log(freq + 1), 0);
        
        const entropy = utils.calculateEntropy(pattern.nextWords, totalWeight);
        
        console.log(`Entropy for learnedPatterns: ${entropy}`);
        
        let threshold = Math.random() * totalWeight;
        for (let [nextWord, freq] of wordEntries) {
          threshold -= Math.log(freq + 1);
          if (threshold <= 0) return nextWord;
        }
      
        return wordEntries[0][0];
      }
    }
  
    return null;
  }
  
  generateSentence(startWord: string, maxLength: number = 10): string {
    let sentence = [startWord];
    let currentWord = startWord;

    for (let i = 0; i < maxLength - 1; i++) {
      const nextWord = this.predictNextWord(currentWord);
      if (!nextWord) break;
      sentence.push(nextWord);
      currentWord = nextWord;
    }

    return sentence.join(" ");
  }
  
  predictBinaryOutput(inputBinary: string): string | null {
    if (this.trainer.binaryPatterns.size === 0) {
      throw new Error("No patterns learned yet!");
    }

    const closestPattern = this.matching.findClosestPattern(inputBinary);
    return closestPattern ? this.trainer.binaryPatterns.get(closestPattern)!.output : null;
  }
}