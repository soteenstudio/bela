declare global {
  import Penalty from "./Penalty.d.ts";
  
  interface PredictTextOption {
    mode: string;
    penalty: Penalty;
    minLength: number;
    maxLength: number;
    maxTest: number;
    logTest: boolean;
    raw: boolean;
  }
}

export {};