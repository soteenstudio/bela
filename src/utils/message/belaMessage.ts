import chalk from "chalk";
import { capitalizeWords } from "../string/capitalizeWords";

export enum Type {
  /** Success */
  SUCCESS = "success",
  
  /** Error */
  ERROR = "error",
  
  /** Epoch */
  EPOCH = "epoch",
  
  /** Test */
  TEST = "test",
  
  /** Other */
  OTHER = "other",
  OTHER_WARNING = "other_warning",
}

export enum Code {
  /** Success */
  SUCCESS_TAKE_ACTION = "B3S1",
  SUCCESS_ALREADY_EXISTS = "B3S2",
  
  /** Warning */
  WARNING_CHOICE_ACTION = "B4W1",
  
  /** Not Fulfilled */
  GENERAL_NOT_FULFILLED = "B1E1",
  GENERAL_CORRUPTED_PROBLEM = "B1E2",
  GENERAL_NOT_FOUND = "B1E4",
  INTERNAL_NOT_FULFILLED = "B2E1",
  INTERNAL_CORRUPTED_PROBLEM = "B2E2",
  INTERNAL_NOT_FOUND = "B2E4",
}

export class BELAMessage {
  static say(data: MessageConfig = {
    type: "error",
    code: 404,
    name: "Error",
    version: "v0.0.4-dev",
    message: "There is an error.",
  }): string {
    const version = "v0.0.4-dev";
    
    const underlineRegex = /_(.*?)_/g;
    const boldRegex = /\*(.*?)\*/g;

    const formattedMessage = typeof data.message === "string" ? 
      data.message
      .replace(underlineRegex, (_, text) => chalk.underline(text))
      .replace(boldRegex, (_, text) => chalk.bold(text))
      : data.message;

    const formattedStack = data.stack
      ? data.stack
          .replace(/[•\-–—]/g, (match) => chalk.grey(match))
          .replace(underlineRegex, (_, text) => chalk.underline(text))
          .replace(boldRegex, (_, text) => chalk.bold(text)) + `\n  ${chalk.grey("•")} ${data.name} ${chalk.bold.underline(data.version ?? version)}\n`
      : `  ${chalk.grey("•")} ${data.name} ${chalk.bold.underline(data.version ?? version)}\n`;

    if (data.type === "error") {
      console.log(
      `${chalk.cyan(data.name)} - ${chalk.red(capitalizeWords(data.type))} ${chalk.grey(data.code + ":")} ${formattedMessage}\n${formattedStack}`);
      return "";
      process.exit(1);
    } else if (data.type === "success") {
      console.log(
      `${chalk.cyan(data.name)} - ${chalk.green(capitalizeWords(data.type))} ${chalk.grey(data.code + ":")} ${formattedMessage}\n${formattedStack}`);
      return "";
    } else if (data.type === "epoch") {
      console.log(
      `${chalk.cyan(data.name)} - ${chalk.green(capitalizeWords(data.type))} ${chalk.grey(data.code + ":")} ${formattedMessage}`);
      return "";
    } else if (data.type === "test") {
      console.log(
      `${chalk.cyan(data.name)} - ${chalk.green(capitalizeWords(data.type))} ${chalk.grey(data.code + ":")} ${formattedMessage}`);
      return "";
    } else if (data.type === "other_warning") {
      return `${chalk.cyan(data.name)} - ${chalk.yellow("Warning")} ${chalk.grey(data.code + ":")} ${formattedMessage}`;
    } else {
      console.log(`Invalid type ${data.type}`);
      return "";
      process.exit(1);
    }
  }
}