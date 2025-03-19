import chalk from "chalk";

export class BELAMessage {
  static say(data: MessageConfig = {
    type: "error",
    code: 404,
    name: "Error",
    message: "There is an error."
  }) {
    const underlineRegex = /_(.*?)_/g;
    const boldRegex = /\*(.*?)\*/g;

    const formattedMessage = data.message
      .replace(underlineRegex, (_, text) => chalk.underline(text))
      .replace(boldRegex, (_, text) => chalk.bold(text));

    const formattedStack = data.stack
      ? data.stack
          .replace(/[•\-–—]/g, (match) => chalk.grey(match))
          .replace(underlineRegex, (_, text) => chalk.underline(text))
          .replace(boldRegex, (_, text) => chalk.bold(text))
      : "";

    if (data.type === "error") {
      console.log(
      `${chalk.cyan(data.name)} - ${chalk.red(data.type)} ${chalk.grey(data.code + ":")} ${formattedMessage}\n${formattedStack}`);
      process.exit(1);
    } else if (data.type === "success") {
      console.log(
      `${chalk.cyan(data.name)} - ${chalk.green(data.type)} ${chalk.grey(data.code + ":")} ${formattedMessage}\n${formattedStack}`);
    } else {
      console.log(`Invalid type ${data.type}`);
      process.exit(1);
    }
  }
}