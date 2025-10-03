import { Trainer } from './trainer';
import { softmax } from "./neuralNet/activations/softmax";
import * as utils from "../utils/";

export class Predictor {
  private responseLength: number = 0;
  
  constructor(
    private trainer: Trainer,
    private temp: number,
    private topP: number
  ) {}
  
  public predictFromRawText(
    text: string,
    maxLength: number,
    presence: number,
    frequency: number,
    repetition: number,
    mode: string = 'autoreg'
  ): string {
    this.responseLength = 0;
    
    let currentText = text;
  
    let predicted: boolean = false;
    while (true) {
      this.responseLength += 1;
      
      const tokens = utils.tokenize(currentText, this.trainer.vocab, this.trainer.maxSubstringToken);
   
      // Kondisi berhenti
      if (mode === 'per-token' && !predicted) {
        if (currentText.includes(utils.SPECIAL_TOKENS.eos)) {
          return currentText;
        } else {
          predicted = true;
        }
      } else if (mode === 'per-token' && predicted) {
        break;
      }
      
      if (
        tokens.length === 0 ||
        tokens.length >= maxLength ||
        currentText.includes(utils.SPECIAL_TOKENS.eos)
      ) {
        break;
      }
  
      // Context vector
      const contextVec = tokens.map(utils.vectorize).flat();
      const inputMatrix = [contextVec];
      const outputVec = this.trainer.runLayers(inputMatrix)[0];
  
      // ===== Tambahan: Repetition
      const tokenCounts: Record<string, number> = {};
      for (const t of tokens) {
        tokenCounts[t] = (tokenCounts[t] || 0) + 1;
      }
  
      const penalizedOutput = [...outputVec];
      for (let i = 0; i < penalizedOutput.length; i++) {
        const tokenStr = utils.detokenize([utils.wordToBinary(String(i))]);
  
        if (tokenCounts[tokenStr]) {
          if (penalizedOutput[i] > 0) {
            penalizedOutput[i] /= repetition;
          } else {
            penalizedOutput[i] *= repetition;
          }
          penalizedOutput[i] -= presence;
          penalizedOutput[i] -= frequency * tokenCounts[tokenStr];
        }
      }
  
      // ===== Temperature Scaling
      const tempOutput = penalizedOutput.map(val => val / this.temp);
      const probabilities = softmax(tempOutput);
  
      // Top-p sampling
      const sortedProbs = [...probabilities].sort((a, b) => b - a);
      let cumulativeProb = 0;
      const topPThreshold = sortedProbs.findIndex(p => {
        cumulativeProb += p;
        return cumulativeProb >= this.topP;
      });
  
      const candidateIndices: number[] = [];
      cumulativeProb = 0;
      for (let i = 0; i < probabilities.length; i++) {
        if (probabilities[i] >= sortedProbs[topPThreshold]) {
          candidateIndices.push(i);
          cumulativeProb += probabilities[i];
        }
      }
  
      const renormalizedProbs = candidateIndices.map(
        idx => probabilities[idx] / cumulativeProb
      );
  
      let randomNum = Math.random();
      let nextTokenIndex = -1;
      for (let i = 0; i < renormalizedProbs.length; i++) {
        randomNum -= renormalizedProbs[i];
        if (randomNum <= 0) {
          nextTokenIndex = candidateIndices[i];
          break;
        }
      }
  
      if (nextTokenIndex === -1) {
        nextTokenIndex = candidateIndices[0];
      }
  
      const binaryId = utils.wordToBinary(String(nextTokenIndex));
      const newText = utils.detokenize([binaryId]);
  
      currentText += newText;
    }
  
    return currentText;
  }
  
  public getResponseLength(): number {
    return this.responseLength;
  }
}
