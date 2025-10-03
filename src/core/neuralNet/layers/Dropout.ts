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