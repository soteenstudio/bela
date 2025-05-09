import * as readline from "readline";
import { Type, Code, BELAMessage } from "./belaMessage";

export const question = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    const ask = () => {
      const formattedQuestion = BELAMessage.say({
        type: Type.OTHER_WARNING,
        code: Code.WARNING_CHOICE_ACTION,
        name: "BELA",
        message
      });

      rl.question(formattedQuestion + " (yes/no) ", (answer) => {
        const lowerAnswer = answer.trim().toLowerCase();

        if (lowerAnswer === "yes") {
          rl.close();
          resolve(true);
        } else if (lowerAnswer === "no") {
          rl.close();
          resolve(false);
        } else {
          ask();
        }
      });
    };

    ask();
  });
};