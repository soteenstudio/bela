/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
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