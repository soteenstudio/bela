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
import { applyActivation } from "./applyActivation";
import { softmax } from "./activations/softmax";

export function applyActivationVector(x: number[], activation: ActivationConfig): number[] {
  if (activation.type === 'softmax') return softmax(x);
  return x.map(v => applyActivation(v, activation));
}