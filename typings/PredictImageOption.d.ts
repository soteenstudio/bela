declare global {
  interface PredictImageOption {
    width: number;
    height: number;
    maxTest: number;
    logTest: boolean;
  }
}

export {};