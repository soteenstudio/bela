/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
import * as utils from '../utils';
import { Layer, Sequential, Dense, Dropout } from "./neuralNet/";
import { softmax } from "./neuralNet/activations/softmax";

export class Trainer {
  public nGramPatterns: Map<string, Map<string, number>> = new Map();
  public totalNGrams: Map<string, number> = new Map();
  public reverseNGrams: Map<string, Map<string, number>> = new Map();
  public learnedPatterns: Map<string, { nextWords: Map<string, number>; totalNextWords: number }> = new Map();
  public frequentPatterns: Set<string>;
  public wordAssociations: Map<string, Map<string, number>> = new Map();
  
  public vocab: string[];
  public maxSubstringToken: number;
  
  public batchInputs: number[][][] = [];
  public batchTargets: number[][][] = [];
  
  public loss: number = 0;
  public correctPredictions: number = 0;
  public totalPredictions: number = 0;
  
  constructor(
    private learningRate: number,
    private batchSize: number,
    public layers: Layer[],
  ) {
    this.frequentPatterns = new Set();
    
    this.vocab = [];
    this.maxSubstringToken = 0;
  }
  
  private trainBatchIfReady(): void {
    if (this.batchInputs.length >= this.batchSize) {
      const batches = this.batchInputs.map((input, i) => ({
        input,
        target: this.batchTargets[i]
      }));
  
      this.batchInputs = [];
      this.batchTargets = [];
  
      for (const { input, target } of batches) {
        this.trainSingleBatch(input, target);
      }
    } else {
      const batches = this.batchInputs.map((input, i) => ({
        input,
        target: this.batchTargets[i]
      }));
      
      this.batchInputs = [];
      this.batchTargets = [];
      
      for (const { input, target } of batches) {
        this.trainSingleBatch(input, target);
      }
    }
  }
  
  private trainSingleBatch(inputVec: number[][], targetVec: number[][]): void {
    const outputVec = this.runLayers(inputVec);
    
    this.calculateAccuracy(outputVec, targetVec);
  
    const gradLoss = this.calculateGradLoss(outputVec, targetVec);
    
    for (let i = 0; i < outputVec.length; i++) {
      for (let j = 0; j < outputVec[i].length; j++) {
        const diff = outputVec[i][j] - targetVec[i][j];
        this.loss += diff * diff;
      }
    }
    this.loss /= this.batchSize;
  
    let grad = gradLoss;
    for (let l = this.layers.length - 1; l >= 0; l--) {
      const layer = this.layers[l];
      if (layer instanceof Dense || layer instanceof Sequential) {
        grad = layer.backward(grad, this.learningRate);
      } else {
        grad = layer.backward(grad);
      }
    }
  }
  
  private calculateGradLoss(outputVec: number[][], targetVec: number[][]): number[][] {
    return outputVec.map((row, i) =>
      row.map((val, j) => 2 * (val - targetVec[i][j]) / this.batchSize)
    );
  }
  
  private calculateAccuracy(outputVec: number[][], targetVec: number[][]): void {
    for (let i = 0; i < outputVec.length; i++) {
      const predictedIndex = outputVec[i].indexOf(Math.max(...outputVec[i]));
      const targetIndex = targetVec[i].indexOf(Math.max(...targetVec[i]));
      
      if (predictedIndex === targetIndex) {
        this.correctPredictions++;
      }
      this.totalPredictions++;
    }
  }
  
  public getAccuracy(): string {
    if (this.totalPredictions === 0) {
      return "0";
    }
    return ((this.correctPredictions / this.totalPredictions) * 100).toFixed(2);
  }
  
  public resetMetrix(): void {
    this.loss = 0;
    this.correctPredictions = 0;
    this.totalPredictions = 0;
  }
  
  learnSentence(
    sentence: string,
    vocab: string[],
    maxSubstringToken: number
  ): void {
      this.vocab = vocab;
      this.maxSubstringToken = maxSubstringToken;
  
      this.learnNGrams(sentence, vocab, maxSubstringToken);
      this.learnGlobalContext(sentence, vocab, maxSubstringToken);
  }
  
  learnNGrams(sentence: string, vocab: string[], maxSubstringToken: number): void {
    const words = utils.tokenize(sentence, vocab, maxSubstringToken);
    const maxPossibleN = words.length - 1;
  
    for (let n = 1; n <= maxPossibleN; n++) {
      for (let i = 0; i <= words.length - n - 1; i++) {
        const contextWords = words.slice(i, i + n); // [K1, K2, ..., Kn]
        const nextWord = words[i + n]; // Q
  
        // Step 1: Dummy dot-product score (bisa upgrade ke vector if available)
        // Konversi semua word ke representasi binary
        const kVectors = contextWords.map(w => utils.vectorize(w));
        const qVector = utils.vectorize(nextWord);
        
        // Dummy dot-product (nanti bisa upgrade ke vector cosine similarity)
        const attentionScores = kVectors.map(kVec => utils.cosine(kVec, qVector));
  
        // Step 2: Softmax weighting
        const attentionWeights = softmax(attentionScores);
  
        // Step 3: Gabung context + attention → jadi key unik
        const wordWeightPairs = contextWords.map((w, idx) => `${w}:${attentionWeights[idx].toFixed(3)}`);
        const nGramKey = wordWeightPairs.join(" | ");
  
        // Step 4: Filter kalau terlalu kecil (opsional, tapi bagus buat pruning noise)
        // Misal: skip kalau attentionnya nyebar banget (entropi tinggi)
        const entropy = -attentionWeights.reduce((acc, w) => acc + w * Math.log2(w || 1e-8), 0);
        if (entropy > Math.log2(contextWords.length)) continue; // skip kalau gak fokus
  
        // Step 5: Simpan pattern
        if (!this.nGramPatterns.has(nGramKey)) {
          this.nGramPatterns.set(nGramKey, new Map());
          this.totalNGrams.set(nGramKey, 0);
        }
  
        const pattern = this.nGramPatterns.get(nGramKey)!;
        pattern.set(nextWord, (pattern.get(nextWord) || 0) + 1);
        this.totalNGrams.set(nGramKey, this.totalNGrams.get(nGramKey)! + 1);
        
        // NEW: Backprop dari context → nextWord (simulasi n-gram training)
        const inputContext = contextWords.map(utils.vectorize).flat();
        const inputMatrix = [inputContext]; // 2D array
        const targetMatrix = [utils.vectorize(nextWord)];
        
        this.batchInputs.push(inputMatrix);
        this.batchTargets.push(targetMatrix);
        this.trainBatchIfReady();
      }
    }
  }
  
  public learnGlobalContext(sentence: string, vocab: string[], maxSubstringToken: number): void {
    this.vocab = vocab;
    this.maxSubstringToken = maxSubstringToken;

    const tokens = utils.tokenize(sentence, vocab, maxSubstringToken);
    if (tokens.length <= 1) return;

    // Vectorisasi semua token sekali saja untuk efisiensi
    const tokenVectors = tokens.map(t => utils.vectorize(t));

    // Ambil representasi global context (mean pooling)
    const globalContextVec = tokenVectors
      .reduce((acc, vec) => acc.map((v, i) => v + vec[i]), new Array(tokenVectors[0].length).fill(0))
      .map(v => v / tokens.length);

    // Untuk setiap token, hitung attention terhadap global context
    tokens.forEach((token, idx) => {
      const tokenVec = tokenVectors[idx];
      const attentionScore = utils.cosine(tokenVec, globalContextVec);

      // Softmax global context → semua token di-normalisasi
      const allScores = tokenVectors.map(vec => utils.cosine(vec, globalContextVec));
      const attentionWeights = softmax(allScores);

      // Buat key global: token:weight
      const globalKey = tokens
        .map((w, i) => `${w}:${attentionWeights[i].toFixed(3)}`)
        .join(" | ");

      // Simpan di learnedPatterns supaya nyambung ke sistem prediksi
      if (!this.learnedPatterns.has(globalKey)) {
        this.learnedPatterns.set(globalKey, { nextWords: new Map(), totalNextWords: 0 });
      }

      // Next word = token berikutnya (atau wrap-around ke awal kalau mau circular)
      const nextToken = tokens[(idx + 1) % tokens.length];
      const pattern = this.learnedPatterns.get(globalKey)!;
      pattern.nextWords.set(nextToken, (pattern.nextWords.get(nextToken) || 0) + 1);
      pattern.totalNextWords += 1;

      // Masukin ke batch training juga
      const inputMatrix = [globalContextVec];
      const targetMatrix = [utils.vectorize(nextToken)];
      this.batchInputs.push(inputMatrix);
      this.batchTargets.push(targetMatrix);
      this.trainBatchIfReady();
    });
  }
  
  getReverseNGram(sentence: string, vocab: string[], maxSubstringToken: number): void {
    const words = utils.tokenize(sentence, vocab, maxSubstringToken);
    const maxPossibleN = words.length - 1;
  
    for (let n = 1; n <= maxPossibleN; n++) {
      for (let i = n; i < words.length; i++) {
        const contextWords = words.slice(i - n, i); // [K1, K2, ..., Kn]
        const currentWord = words[i]; // Q (kata yang muncul setelah konteks, tapi sekarang dipetakan ke reverse)
  
        // Step 1: Vectorisasi
        const kVectors = contextWords.map(w => utils.vectorize(w));
        const qVector = utils.vectorize(currentWord);
  
        // Step 2: Attention pakai cosine + softmax
        const attentionScores = kVectors.map(kVec => utils.cosine(kVec, qVector));
        const attentionWeights = softmax(attentionScores);
  
        // Step 3: Filter berdasarkan entropy
        const entropy = -attentionWeights.reduce((acc, w) => acc + w * Math.log2(w || 1e-8), 0);
        if (entropy > Math.log2(contextWords.length)) continue; // skip kalau terlalu nyebar
  
        // Step 4: Bentuk context key adaptif
        const tokenWeightPairs = contextWords.map(
          (w, idx) => `${w}:${attentionWeights[idx].toFixed(3)}`
        );
        const contextKey = tokenWeightPairs.join(" | ");
  
        // Step 5: Simpan ke reverse map
        if (!this.reverseNGrams.get(currentWord)) {
          this.reverseNGrams.set(currentWord, new Map());
        }
  
        const reverseMap = this.reverseNGrams.get(currentWord)!;
        reverseMap.set(contextKey, (reverseMap.get(contextKey) ?? 0) + 1);
      }
    }
  }
  
  getMostLikelyWord(candidates: string[]): string | null {
    if (!candidates.length) return null;

    let wordCount: Record<string, number> = {};
    for (let word of candidates) {
        wordCount[word] = (wordCount[word] || 0) + 1;
    }

    let sortedWords = Object.entries(wordCount).sort((a, b) => b[1] - a[1]);

    return sortedWords[0][0]; // Ambil kata dengan kemunculan terbanyak
  }
  
  getPredictionConfidence(word: string): number {
    const pattern = this.learnedPatterns.get(word);
    if (!pattern) return 0;
  
    let maxFreq = 0;
    for (let val of pattern.nextWords.values()) {
      if (val > maxFreq) maxFreq = val;
    }
  
    return maxFreq / pattern.totalNextWords;
  }
  
  private getNGramDistribution(contextWords: string[], fallbackToken: string): number[] {
    const kVectors = contextWords.map(w => utils.vectorize(w));
    const qVector = utils.vectorize(fallbackToken);
  
    const attentionScores = kVectors.map(kVec => utils.cosine(kVec, qVector));
    const attentionWeights = softmax(attentionScores);
    const wordWeightPairs = contextWords.map((w, idx) => `${w}:${attentionWeights[idx].toFixed(3)}`);
    const nGramKey = wordWeightPairs.join(" | ");
  
    const pattern = this.nGramPatterns.get(nGramKey);
    const total = this.totalNGrams.get(nGramKey) || 1;
  
    // Balikin distribusi probabilitas (dalam format vector panjang vocab)
    return this.vocab.map((word) => {
      const count = pattern?.get(word) || 0;
      return count / total;
    });
  }
  
  public runLayers(input: number[][]): number[][] {
    return this.layers.reduce((prev, layer) => layer.forward(prev), input);
  }
  
  public getLayers(): Layer[] {
    return this.layers;
  }
}