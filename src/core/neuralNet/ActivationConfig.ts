interface GeneralActivation {
  type: "relu" | "sigmoid" | "tanh" | "softmax" | "gelu" | "none";
}

interface TeLUActivation {
  type: "telu";
  beta: number;
  alpha: number;
  gamma: number;
}

export type ActivationConfig = GeneralActivation | TeLUActivation;
