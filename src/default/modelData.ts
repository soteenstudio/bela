/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
import { Layer } from "../core/neuralNet/";

export const modelData: ModelData = {
  parameters: {
    training: {
      epochs: 0,
      learningRate: 0,
      batchSize: 0,
      layers: [] as Layer[]
    },
    inference: {
      temp: 0,
      topP: 0
    }
  }
}