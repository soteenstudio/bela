import * as fs from 'fs';
import * as path from 'path'
import chalk from "chalk";
import * as utils from './utils/';
import * as core from './core/';
import * as def from "./default/";
import { Layer, Sequential, Dense, Dropout, BatchNorm, TiLaS } from "./core/neuralNet/";

export class BELA {
  private isModel: boolean = false;
  private packageRoot: string = path.dirname(require.main?.filename ?? process.cwd());
  
  private Trainer: core.Trainer;
  private Predictor: core.Predictor;
  private Manager: core.Manager;
  private vocabs: string[];
  
  private epochs: number;
  private learningRate: number;
  private batchSize: number;
  private layers: Layer[];
  
  private temp: number;
  private topP: number;
  
  private pathRoot: string;
  private pathModel: string;
  private pathBackup: string;
  private autoIncrement: boolean;
  private autoDelete: boolean;
  private autoDeleteMax: number;
  private maxTokenLength: number;

  constructor(config: Configuration = {}) {
    this.epochs = config.parameter?.training?.epochs ?? 5;
    this.learningRate = config.parameter?.training?.learningRate ?? 0.05;
    this.batchSize = config.parameter?.training?.batchSize ?? 16;
    this.layers = config.parameter?.training?.layers ?? [];
    
    this.temp = config.parameter?.inference?.temp ?? 0.7;
    this.topP = config.parameter?.inference?.topP ?? 0.8;
    
    this.pathRoot = config.path?.root ?? "./";
    this.pathModel = config.path?.model ?? "./";
    this.pathBackup = config.path?.backup ?? "./";
    this.autoIncrement = config?.autoIncrement ?? true;
    this.autoDelete = config?.autoDelete ?? true;
    this.autoDeleteMax = config?.autoDeleteMax ?? 10;
    
    this.vocabs = [];
    this.maxTokenLength = 5;
    
    this.Trainer = new core.Trainer(
      this.learningRate,
      this.batchSize,
      this.layers,
    );
    //this.Matching = new core.Matching(this.Trainer);
    this.Predictor = new core.Predictor(
      this.Trainer,
      this.temp,
      this.topP
    );
    this.Manager = new core.Manager(
      this.Trainer,
      this.epochs,
      this.learningRate,
      this.batchSize,
      this.layers,
      this.temp,
      this.topP,
      this.packageRoot,
      this.pathRoot,
      this.pathModel,
      this.pathBackup
    );
  }

  train(
    dataset: (ConversationDataset)[],
    vocabs: string[],
    maxTokenLength: number
  ): void {
    utils.setVocab(vocabs);
    this.vocabs = vocabs;
    this.maxTokenLength = maxTokenLength;
    
    if (
      !dataset ||
      dataset.length === 0 ||
      !vocabs ||
      vocabs.length === 0 ||
      typeof maxTokenLength !== "number"
    ) {
      throw utils.BELAMessage.say({
        type: utils.Type.ERROR,
        code: utils.Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: `${
          !dataset || dataset.length === 0 ?
          "Training dataset cannot be empty." :
          !vocabs || vocabs.length === 0 ?
          "Vocab training cannot be empty." : "maxTokenLength must be of type number"
        }`
      });
    }
    
    if (this.epochs) {
      for (let epoch = 0; epoch < this.epochs; epoch++) {
        this.Trainer.resetMetrix();
        
        try {
          const sentences = utils.preprocessDataset(dataset);
          sentences.map(sentence => {
            this.Trainer.learnSentence(
              sentence,
              this.vocabs,
              maxTokenLength
            );
            this.Trainer.getReverseNGram(
              sentence,
              this.vocabs,
              this.maxTokenLength
            );
          });
          utils.BELAMessage.say({
            type: utils.Type.EPOCH,
            code: `${epoch + 1}/${this.epochs}`,
            name: "BELA",
            message: `is complete.\n     - ${chalk.green("Loss")}     ${chalk.grey(":")} ${this.Trainer.loss.toFixed(4)}\n     - ${chalk.green("Acc")}      ${chalk.grey(":")} ${this.Trainer.getAccuracy()}%` + ((epoch + 1) === this.epochs ? "\n" : "")
          });
        } catch (err) {
          throw utils.BELAMessage.say({
            type: utils.Type.ERROR,
            code: utils.Code.GENERAL_CORRUPTED_PROBLEM,
            name: "BELA",
            message: "Corrupted training dataset."
          });
        }
      }
    }
    
    this.isModel = true;
  }
  
  async fineTune(
    dataset: ConversationDataset[],
    vocabs: string[],
    maxTokenLength: number
  ): Promise<void> {
    if (this.Manager.currentModel === def.modelData) {
      throw utils.BELAMessage.say({
        type: utils.Type.ERROR,
        code: utils.Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "Model must be loaded before fine-tuning."
      });
    }
    
    if (!dataset || dataset.length === 0) {
      throw utils.BELAMessage.say({
        type: utils.Type.ERROR,
        code: utils.Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "Fine-tuning dataset cannot be empty."
      });
    }
    
    utils.setVocab(vocabs);
    this.maxTokenLength = maxTokenLength;
    
    if (this.epochs) {
      for (let epoch = 0; epoch < this.epochs; epoch++) {
        if (!Array.isArray(dataset) || !dataset.every(item => typeof item === "object" && item !== null)) {
          throw utils.BELAMessage.say({
            type: utils.Type.ERROR,
            code: utils.Code.GENERAL_NOT_FULFILLED,
            name: "BELA",
            message: "Dataset must be of type array of objects."
          });
        }
      
        try {
          dataset.forEach(({ input, output }) => {
            this.Trainer.learnSentence(input, this.vocabs, maxTokenLength);
            this.Trainer.learnSentence(output, this.vocabs, maxTokenLength);
          });
          utils.BELAMessage.say({
            type: utils.Type.EPOCH,
            code: epoch + 1,
            name: "BELA",
            message: "is complete."
          });
        } catch (err) {
          throw utils.BELAMessage.say({
            type: utils.Type.ERROR,
            code: utils.Code.GENERAL_CORRUPTED_PROBLEM,
            name: "BELA",
            message: "Corrupted fine-tuning dataset."
          });
        }
      }
    }
    
    const oldModelData: ModelData = this.Manager.currentModel;
    
    const newModelData: ModelData = {
      parameters: {
        training: {
          epochs: this.epochs,
          learningRate: this.learningRate,
          batchSize: this.batchSize,
          layers: this.layers
        },
        inference: {
          temp: this.temp,
          topP: this.topP
        }
      }
    };
    
    const mergedModelData: ModelData = {
      parameters: {
        ...oldModelData.parameters,
        ...newModelData.parameters,
      },
    };
    
    const saveModelPath = path.join(
      this.packageRoot,
      this.pathRoot,
      this.pathModel,
      this.Manager.filename
    );
    
    fs.writeFileSync(saveModelPath, await utils.secure(mergedModelData, this.Manager.password), "utf8");
  }

  info(options: Option = {}): Parameter | ModelData | object {
    console.log(options.parameter);
    if (options.parameter && options.parameter === true) {
      return {
        training: {
          epochs: this.epochs,
          learningRate: this.learningRate,
          batchSize: this.batchSize,
          layers: this.layers
        },
        inference: {
          temp: this.temp,
          topP: this.topP
        }
      };
    } else if (options.training && options.training === true) {
      const nextWordsInfo: object[] = [];
      const binaryPatternsInfo: object[] = [];
      const frequentlyPatternsInfo: object[] = [];
      
      for (let [word, data] of this.Trainer.learnedPatterns) {
        nextWordsInfo.push({ word: [data.nextWords] });
      }
      
      this.Trainer.frequentPatterns.forEach(pattern => {
        frequentlyPatternsInfo.push({ pattern });
      });
      
      return {
        nextWordsInfo,
        binaryPatternsInfo,
        frequentlyPatternsInfo
      };
    }
    return {};
  }

  predictText(
    prompt: string,
    vocabs?: string[],
    maxTokenLength?: number,
    options: PredictTextOption = {
      mode: 'autoreg',
      penalty: {
        presence: 0.5,
        frequency: 0.4,
        repetition: 1.2,
      },
      minLength: 2,
      maxLength: 5,
      maxTest: 3,
      logTest: false,
      raw: false,
    }
  ): string | string[] {
    utils.setVocab(vocabs as string[]);
    if (
      typeof prompt !== "string" ||
      typeof options.maxLength !== "number" ||
      typeof options.maxTest !== "number" ||
      typeof options.logTest !== "boolean"
    ) {
      throw utils.BELAMessage.say({
        type: utils.Type.ERROR,
        code: utils.Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: `${
          typeof prompt !== "string" ?
          "Prompt must be of type string." :
          typeof options.maxLength !== "number" ?
          "maxLength must be of type number." :
          typeof options.maxTest !== "number" ?
          "maxTest must be of type number." :
          "logTest must be of type boolean."
        }`
      });
    }
    
    if (!this.isModel) {
      throw utils.BELAMessage.say({
        type: utils.Type.ERROR,
        code: utils.Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "Model has not been trained or loaded."
      });
    }
    
    if (!prompt) {
      throw utils.BELAMessage.say({
        type: utils.Type.ERROR,
        code: utils.Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "Prediction prompts cannot be empty."
      });
    }
    
    let response: string = "";
    let newResponse: string | string[] = [];
    for (let test = 0; test < options.maxTest; test++) {
      let tokenized = utils.preprocessUserText(prompt);
      let tokens = utils.tokenize(
        tokenized,
        vocabs || this.vocabs,
        maxTokenLength || this.maxTokenLength
      )
      
      response = this.Predictor.predictFromRawText(prompt, options.maxLength, options.penalty.presence, options.penalty.frequency, options.penalty.repetition, options.mode);
      
      /*for (let j = 0; j < response.length; j++) {
        newResponse.push(utils.tokenToWord(newResponse[j]));
      }*/
      
      if (options.logTest) {
        utils.BELAMessage.say({
          type: utils.Type.TEST,
          code: test + 1,
          name: "BELA",
          message: `${(options.raw ? utils.tokenize(response, vocabs || this.vocabs, maxTokenLength || this.maxTokenLength).map(t => utils.tokenToWord(utils.binaryToWord(t))) : utils.postProcess(String(response))) as string}\n     - ${chalk.green("Length")}${chalk.grey(":")} ${this.Predictor.getResponseLength()}`
        });
      }
    }
    
    return options.raw ? utils.tokenize(response, vocabs || this.vocabs, maxTokenLength || this.maxTokenLength).map(t => utils.tokenToWord(utils.binaryToWord(t))) : utils.postProcess(String(response));
  }
  
  async save(
    name: string,
    options: SaveOption = {
      password: "",
      metadata: def.metadata
    }
  ): Promise<void> {
    if (!name) {
      throw utils.BELAMessage.say({
        type: utils.Type.ERROR,
        code: utils.Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "File or model name cannot be empty."
      });
    }
    
    if (!options.password) {
      throw utils.BELAMessage.say({
        type: utils.Type.ERROR,
        code: utils.Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "password cannot be empty."
      });
    }
    
    if (this.autoIncrement === false && !name.endsWith('.belamodel')) {
      throw utils.BELAMessage.say({
        type: utils.Type.ERROR,
        code: utils.Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "File names do not end in .belamodel."
      });
    }
    
    if (this.autoDelete) {
      await this.Manager.save(
        name,
        utils.padChar(options.password),
        this.autoDeleteMax ?? 10,
        true,
        options.metadata
      );
      return;
    }
    
    await this.Manager.save(
      name, 
      utils.padChar(options.password), 
      this.autoDeleteMax ?? 10, 
      false, 
      options.metadata
    );
  }
  
  async load(
    name: string,
    options: LoadOption = {
      password: ""
    }
  ): Promise<void> {
    if (!name) {
      throw utils.BELAMessage.say({
        type: utils.Type.ERROR,
        code: utils.Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "File or model name cannot be empty."
      });
    }
    
    if (!options.password) {
      throw utils.BELAMessage.say({
        type: utils.Type.ERROR,
        code: utils.Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "password cannot be empty."
      });
    }
    
    if (this.autoIncrement === false && !name.endsWith('.belamodel')) {
      throw utils.BELAMessage.say({
        type: utils.Type.ERROR,
        code: utils.Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "File names do not end in .belamodel."
      });
    }
    
    const data: ModelData = await this.Manager.load(
      name, 
      utils.padChar(options.password)
    );

    if (!data || !data.parameters) {
      throw utils.BELAMessage.say({
        type: utils.Type.ERROR,
        code: utils.Code.INTERNAL_NOT_FULFILLED,
        name: "BELA",
        message: this.autoIncrement ? `Failed to read model data with name ${name}.` : `Failed to read data model from file named ${name}.`
      });
    }
    
    this.epochs = data.parameters.training.epochs as number;
    this.batchSize = data.parameters.training.batchSize as number;
    this.learningRate = data.parameters.training.learningRate as number;
    this.layers = data.parameters.training.layers as Layer[];
    
    this.temp = data.parameters.inference.temperature as number;
    this.topP = data.parameters.inference.topP as number;
    
    this.isModel = true;
  }
  
  async move(
    from: string,
    fromOptions: FromOption = {
      password: ""
    },
    to: string,
    toOptions: ToOption = {
      password: ""
    }
  ): Promise<void> {
    await this.Manager.move(
      from,
      utils.padChar(fromOptions.password),
      to,
      utils.padChar(toOptions.password)
    );
  }
  
  async read(
    name: string,
    options: ReadOption = {
      password: ""
    }
  ): Promise<ModelData> {
    return await this.Manager.read(
      name,
      utils.padChar(options.password)
    );
  }
  
  vocab(
    data: ConversationDataset[] | ImageDataset[],
    vocabSize = 50
  ): string[] {
    const tokenFreq = new Map<string, number>();
  
    // 1. Init: tiap kata di-split jadi array huruf, diawali dengan "▁"
    const wordList: string[][] = [];
    if (utils.isConversationDataset(data)) {
      for (const pair of data) {
        const combinedText = (`▁${pair.input} ▁${pair.output}`).toLowerCase();
        const words = combinedText.split(/\s+/);
        for (const word of words) {
          if (word === "<eos>") {
            wordList.push([word]);
          } else {
            const chars = word.split('');
            chars.unshift('▁');
            wordList.push(chars);
          }
        }
      }
    } else if (utils.isImageDataset(data)) {
      for (const pair of data) {
        const combinedText = (`▁${pair.title}`).toLowerCase();
        const words = combinedText.split(/\s+/);
        for (const word of words) {
          const chars = word.split('');
          chars.unshift('▁');
          wordList.push(chars);
        }
      }
    }
  
    // 2. Hitung freq semua pair token
    for (const word of wordList) {
      for (let i = 0; i < word.length - 1; i++) {
        const pair = `${word[i]} ${word[i + 1]}`;
        tokenFreq.set(pair, (tokenFreq.get(pair) || 0) + 1);
      }
    }
  
    // 3. Inisialisasi vocab dengan karakter unik
    const vocabSet = new Set<string>();
    wordList.forEach(w => w.forEach(ch => vocabSet.add(ch)));
  
    // 4. Loop merge pair paling sering
    while (vocabSet.size < vocabSize && tokenFreq.size > 0) {
      // Cari pair dengan freq tertinggi
      const [bestPair] = [...tokenFreq.entries()].sort((a, b) => b[1] - a[1])[0];
      const [a, b] = bestPair.split(" ");
  
      const merged = a + b;
      
      // Tambah pair ke vocab
      const cleanMerge = merged.replace(/▁{2,}/g, '▁');
      vocabSet.add(cleanMerge);
  
      // Update wordList (replace pair a b -> ab)
      for (let w = 0; w < wordList.length; w++) {
        const word = wordList[w];
        const newWord: string[] = [];
        let i = 0;
        while (i < word.length) {
          if (i < word.length - 1 && word[i] === a && word[i + 1] === b) {
            newWord.push(cleanMerge);
            i += 2;
          } else {
            newWord.push(word[i]);
            i++;
          }
        }
        wordList[w] = newWord;
      }
  
      // Re-hitungan ulang pair freq
      tokenFreq.clear();
      for (const word of wordList) {
        for (let i = 0; i < word.length - 1; i++) {
          const pair = `${word[i]} ${word[i + 1]}`;
          tokenFreq.set(pair, (tokenFreq.get(pair) || 0) + 1);
        }
      }
    }
  
    const specials = Object.values(utils.SPECIAL_TOKENS);
    
    return [
      ...specials,
      ...Array.from(vocabSet).filter(token => 
        token !== "" &&
        !/▁{2,}/.test(token) &&
        specials.every(special => !token.includes(special))
      )
    ];
  }
  
  chat(data: ChatOptions, vocabs: string[]): core.Chat {
    return new core.Chat(data, vocabs, this.Predictor);
  }
}

export {
  Sequential,
  Dense,
  Dropout,
  BatchNorm,
  TiLaS
};