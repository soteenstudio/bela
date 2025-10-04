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
import { applyActivationVector } from "../applyActivationVector";
import { applyActivationDerivative } from "../applyActivationDerivative";
import { Layer } from "./Layer";

export class Dense extends Layer {
  private weights: number[][] | null = null;
  private biases: number[] | null = null;
  private input: number[][] | null = null;
  private z: number[][] | null = null;

  constructor(
    public units: number,
    public activation: ActivationConfig = { type: 'none' },
  ) {
    super();
  }

  private initialize(inputSize: number) {
    this.weights = Array.from({ length: this.units }, () =>
      Array.from({ length: inputSize }, () => Math.random() * 2 - 1)
    );
    this.biases = Array.from({ length: this.units }, () => Math.random() * 2 - 1);
  }

  forward(inputs: number[][], training: boolean = false): number[][] {
    if (!this.weights || !this.biases) {
      this.initialize(inputs[0].length);
    }

    this.input = inputs;
    this.z = inputs.map(input =>
      this.weights!.map((wRow, i) =>
        wRow.reduce((sum, w, j) => sum + w * input[j], this.biases![i])
      )
    );

    return this.z.map(zRow => applyActivationVector(zRow, this.activation));
  }

  backward(gradOutput: number[][], lr: number = 0.01): number[][] {
    if (!this.input || !this.z || !this.weights || !this.biases) throw new Error("Forward belum dipanggil.");

    const batchSize = gradOutput.length;
    const inputSize = this.weights[0].length;

    const gradInput: number[][] = this.input.map(() => Array(inputSize).fill(0));

    for (let i = 0; i < batchSize; i++) {
      const inputRow = this.input[i];
      const zRow = this.z[i];
      const gradOutRow = gradOutput[i];

      let activationDerivatives: number[];
      if (this.activation.type === 'softmax') {
        // softmax: anggap loss-nya pakai cross-entropy
        activationDerivatives = Array.from({ length: gradOutRow.length }, () => 1); // asumsi dL/dZ = pred - target
      } else {
        activationDerivatives = zRow.map((z, j) => applyActivationDerivative(z, this.activation));
      }

      for (let j = 0; j < this.units; j++) {
        const dLdz = gradOutRow[j] * activationDerivatives[j];

        for (let k = 0; k < inputSize; k++) {
          gradInput[i][k] += dLdz * this.weights[j][k];
          // update bobot bisa ditaruh di sini kalau mau (SGD)
          this.weights[j][k] -= lr * dLdz * inputRow[k];
        }

        // update bias juga kalau mau
        this.biases[j] -= lr * dLdz;
      }
    }

    return gradInput;
  }
  
  toJSON() {
    return {
      type: 'Dense',
      units: this.units,
      activation: this.activation,
      weights: this.weights,
      biases: this.biases,
    };
  }

  static fromJSON(data: any): Dense {
    const layer = new Dense(data.units, data.activation);
    layer.weights = data.weights;
    layer.biases = data.biases;
    return layer;
  }
}