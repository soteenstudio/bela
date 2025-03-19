declare interface MessageConfig {
  type: "success" | "error";
  code: 200 | 201 | 204 | 400 | 403 | 404 | 415;
  name: string;
  message: string;
  stack?: string;
}