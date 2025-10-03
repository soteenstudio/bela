import { ActivationConfig } from "../ActivationConfig";
import { Layer } from "./Layer";
import { Dense } from "./Dense";
import { Dropout } from "./Dropout";

export class TiLaS extends Layer {
  private layers: Layer[];
  
  constructor(
    public units: number,
    public rate: number,
    public activation: ActivationConfig
  ) {
    super();
    this.layers = [
      new Dense(units, activation),
      new Dropout(rate),
      new Dense(units, activation),
      new Dropout(rate),
      new Dense(12, { type: "softmax" })
    ]
  }
  
  forward(input: number[][], training: boolean = false): number[][] {
    return this.layers.reduce(
      (output, layer) => layer.forward(output, training),
      input
    );
  }

  backward(gradOutput: number[][], lr: number = 0.01): number[][] {
    return this.layers.reduceRight(
      (grad, layer) => layer instanceof Dense ? layer.backward(grad, lr) : layer.backward(grad),
      gradOutput
    );
  }
}