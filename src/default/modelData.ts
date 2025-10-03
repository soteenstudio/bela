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