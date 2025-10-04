/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
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
