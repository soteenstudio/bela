import { ActivationConfig } from "./ActivationConfig";
import { relu as ReLU } from "./activations/relu";
import { sigmoid as Sigmoid } from "./activations/sigmoid";
import { tanh as Tanh } from "./activations/tanh";
import { gelu as GELU } from "./activations/gelu";
import { telu as TeLU } from "./activations/telu";

export function applyActivation(
  x: number,
  activation: ActivationConfig
): number {
  switch (activation.type) {
    case 'relu': return ReLU(x);
    case 'sigmoid': return Sigmoid(x);
    case 'tanh': return Tanh(x);
    case 'gelu': return GELU(x);
    case 'telu': {
      if (activation.beta && activation.alpha && activation.gamma) {
        return TeLU(
          x,
          activation.beta,
          activation.alpha,
          activation.gamma
        );
      }
    }
    case 'none': default: return x;
  }
}