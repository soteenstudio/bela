declare interface MessageConfig {
  type: "success" | "error" | "epoch" | "test" | "other_warning";
  code: string | number;
  name: string;
  version?: string;
  message: string;
  stack?: string;
}