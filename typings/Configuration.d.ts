declare global {
  import Parameter from "./Parameter";
  import Path from "./Path.";

  interface Configuration {
    parameter?: Parameter;
    path?: Path;
    autoIncrement?: boolean;
    autoDelete?: boolean;
    autoDeleteMax?: number;
  }
}

export {};