/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
import { ActivationConfig } from "./ActivationConfig";
import { relu as ReLU } from "./derivatives/relu";
import { sigmoid as Sigmoid } from "./derivatives/sigmoid";
import { tanh as Tanh } from "./derivatives/tanh";
import { gelu as GELU } from "./derivatives/gelu";
import { telu as TeLU } from "./derivatives/telu";

export function applyActivationDerivative(
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
    case 'none': default: return 1;
  }
}