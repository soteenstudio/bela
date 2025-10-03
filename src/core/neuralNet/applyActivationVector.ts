import { ActivationConfig } from "./ActivationConfig";
import { applyActivation } from "./applyActivation";
import { softmax } from "./activations/softmax";

export function applyActivationVector(x: number[], activation: ActivationConfig): number[] {
  if (activation.type === 'softmax') return softmax(x);
  return x.map(v => applyActivation(v, activation));
}