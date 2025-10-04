/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
export const isImageDataset = (
  dataset: (ConversationDataset | ImageDataset)[],
): dataset is ImageDataset[] =>
  typeof dataset[0] === "object" &&
  dataset[0] !== null &&
  "title" in dataset[0] && 
  "image" in dataset[0];