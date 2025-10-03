declare global {
  import Training from "./Training";
  import Inference from "./Inference";
  
  interface Parameter {
    training?: Training;
    inference?: Inference;
  }
}

export {};