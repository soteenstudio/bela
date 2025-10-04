/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
import { ActivationConfig } from "../ActivationConfig";
import { Layer } from "./Layer";

export class BatchNorm extends Layer {
  private gamma: number[];
  private beta: number[];
  private mean: number[] = [];
  private variance: number[] = [];
  private input: number[][] = [];

  constructor(private epsilon = 1e-5) {
    super();
    this.gamma = [];
    this.beta = [];
  }

  forward(inputs: number[][]): number[][] {
    this.input = inputs;
    const inputDim = inputs[0].length;

    this.mean = Array(inputDim).fill(0);
    this.variance = Array(inputDim).fill(0);

    for (let j = 0; j < inputDim; j++) {
      const col = inputs.map(row => row[j]);
      const mean = col.reduce((a, b) => a + b, 0) / inputs.length;
      const variance = col.reduce((a, b) => a + (b - mean) ** 2, 0) / inputs.length;
      this.mean[j] = mean;
      this.variance[j] = variance;
    }

    if (this.gamma.length === 0) {
      this.gamma = Array(inputDim).fill(1);
      this.beta = Array(inputDim).fill(0);
    }

    return inputs.map(row =>
      row.map((val, j) =>
        this.gamma[j] * ((val - this.mean[j]) / Math.sqrt(this.variance[j] + this.epsilon)) + this.beta[j]
      )
    );
  }

  backward(gradOutput: number[][]): number[][] {
      const inputDim = this.input[0].length;
      const batchSize = this.input.length;
  
      const dGamma = Array(inputDim).fill(0);
      const dBeta = Array(inputDim).fill(0);
      const gradInput = Array(batchSize).fill(0).map(() => Array(inputDim).fill(0));
  
      const normalizedInput = this.input.map(row =>
        row.map((val, j) =>
          (val - this.mean[j]) / Math.sqrt(this.variance[j] + this.epsilon)
        )
      );
  
      // Hitung dGamma dan dBeta
      for (let j = 0; j < inputDim; j++) {
          let sum_dGamma = 0;
          let sum_dBeta = 0;
          for (let i = 0; i < batchSize; i++) {
              sum_dGamma += gradOutput[i][j] * normalizedInput[i][j];
              sum_dBeta += gradOutput[i][j];
          }
          dGamma[j] = sum_dGamma;
          dBeta[j] = sum_dBeta;
      }
      
      // Update gamma dan beta (kalau ini yang lu mau)
      // this.gamma = this.gamma.map((g, j) => g - learningRate * dGamma[j]);
      // this.beta = this.beta.map((b, j) => b - learningRate * dBeta[j]);
  
      // Hitung gradien untuk input (diteruskan ke layer sebelumnya)
      for (let i = 0; i < batchSize; i++) {
          for (let j = 0; j < inputDim; j++) {
              const val_minus_mean = this.input[i][j] - this.mean[j];
              const std_dev = Math.sqrt(this.variance[j] + this.epsilon);
  
              // Ini bagian paling tricky, hasil dari chain rule
              gradInput[i][j] =
                  (this.gamma[j] / std_dev) * gradOutput[i][j] -
                  (this.gamma[j] * val_minus_mean / (batchSize * std_dev ** 3)) * dGamma[j] -
                  (this.gamma[j] / (batchSize * std_dev)) * dBeta[j];
          }
      }
  
      return gradInput;
  }
  
  toJSON() {
    return {
      type: 'BatchNorm',
      gamma: this.gamma,
      beta: this.beta,
      mean: this.mean,
      variance: this.variance,
      input: this.input,
    };
  }
  
  static fromJSON(data: any): BatchNorm {
    const layer = new BatchNorm();
    layer.gamma = data.gamma;
    layer.beta = data.beta;
    layer.mean = data.mean;
    layer.variance = data.variance;
    layer.input = data.input;
    return layer;
  }
}