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

export class Dropout extends Layer {
  private mask: number[][] = [];

  constructor(public rate: number) {
    super();
  }

  forward(inputs: number[][], training: boolean = false): number[][] {
    if (!training || this.rate <= 0) return inputs;

    this.mask = inputs.map(row =>
      row.map(() => (Math.random() < this.rate ? 0 : 1))
    );

    return inputs.map((row, i) =>
      row.map((val, j) => val * this.mask[i][j])
    );
  }

  backward(gradOutput: number[][]): number[][] {
    if (this.mask.length === 0) return gradOutput;
    return gradOutput.map((row, i) =>
      row.map((val, j) => val * this.mask[i][j])
    );
  }
}