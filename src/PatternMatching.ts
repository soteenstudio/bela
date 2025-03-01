import { PatternTrainer } from './PatternTrainer';
import * as utils from './utils/utils';

export class PatternMatching {
  private synonymMap: Map<string, string[]> = new Map([
    ["baik", ["bagus", "mantap", "positif"]],
    ["buruk", ["jelek", "negatif", "gak bagus"]],
  ]);
  
  constructor(private trainer: PatternTrainer) {}
  
  findClosestPattern(inputBinary: string): string | null {
    let closestPattern: string | null = null;
    let closestDistance = Infinity;

    for (let [binary] of this.trainer.binaryPatterns) {
      const distance = utils.calculateHammingDistance(inputBinary, binary);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPattern = binary;
      }
    }

    return closestPattern;
  }
  
  findClosestWord(inputWord: string): string | null {
      if (this.synonymMap.has(inputWord)) {
          return this.synonymMap.get(inputWord)![0];
      }
  
      let closestWord: string | null = null;
      let minDistance = Infinity;
  
      for (let word of this.trainer.learnedPatterns.keys()) {
          const distance = utils.calculateHammingDistance(utils.wordToBinary(inputWord), utils.wordToBinary(word));
          if (distance < minDistance) {
              minDistance = distance;
              closestWord = word;
          }
      }
  
      return closestWord;
  }
}