export abstract class Layer {
  abstract forward(input: number[][], training?: boolean): number[][];
  abstract backward(gradOutput: number[][]): number[][];
}