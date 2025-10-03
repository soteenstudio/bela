import { ActivationConfig } from "../ActivationConfig";
import { Layer } from "./Layer";
import { Dense } from "./Dense";
import { Dropout } from "./Dropout";
import { BatchNorm } from "./BatchNorm";

export class Sequential extends Layer {
  constructor(public layers: Layer[]) {
    super();
  }

  forward(input: number[][], training: boolean = false): number[][] {
    return this.layers.reduce(
      (output, layer) => layer.forward(output, training),
      input
    );
  }

  backward(gradOutput: number[][], lr: number = 0.01): number[][] {
    return this.layers.reduceRight(
      (grad, layer) => layer instanceof Dense ? layer.backward(grad, lr) : layer.backward(grad),
      gradOutput
    );
  }
  
  toJSON() {
    return {
      type: 'Sequential',
      layers: this.layers.map(layer =>
        (layer as any).toJSON?.() ?? { type: 'Unknown' }
      )
    };
  }
  
  static fromJSON(data: any): Sequential {
    const layers = data.layers.map((layerData: any) => {
      switch (layerData.type) {
        case 'Dense': return Dense.fromJSON(layerData);
        case 'Dropout': return new Dropout(layerData.rate);
        case 'BatchNorm': return new BatchNorm(); // tweak sesuai kebutuhan
        default: throw new Error(`Unknown layer type: ${layerData.type}`);
      }
    });
    return new Sequential(layers);
  }
}