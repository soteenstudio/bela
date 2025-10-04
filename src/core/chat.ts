/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */

import { Predictor } from "./predictor";
import * as utils from "../utils";

export class Chat {
  private history: string = "";
  private predictor: Predictor;

  constructor(
    data: ChatOptions,
    vocabs: string[],
    predictor: Predictor
  ) {
    const temp: string[] = [];
    // ubah loop supaya user+bot jadi satu baris
    for (let i = 0; i < data.history.length; i += 2) {
      const userMsg = data.history[i];
      const botMsg = data.history[i + 1];
      const line =
        `<bos><${userMsg.role}>${userMsg.messages}<eos>` +
        (botMsg ? `<${botMsg.role}>${botMsg.messages}<eos>` : "");
      temp.push(line);
    }
    this.history = temp.join("\n");
    this.predictor = predictor;
    utils.setVocab(vocabs as string[]);
  }

  sendMessage(prompt: string, maxLength: number): string {
    // bikin line baru user+bot jadi satu
    const userLine = utils.preprocessUserText(prompt, maxLength);

    const reply = this.predictor.predictFromRawText(this.history + "\n" + userLine);
    
    console.log("Reply: ", reply);

    const botLine = `${reply}<eos>`;

    // append ke history jadi satu baris
    this.history += (this.history ? "\n" : "") + userLine + botLine;

    return reply;
  }
}