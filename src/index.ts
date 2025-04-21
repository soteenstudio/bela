import * as utils from './utils/';
import * as fs from 'fs';
import * as path from 'path'
import { PatternTrainer } from './PatternTrainer';
import { PatternPredictor } from './PatternPredictor';
import { PatternMatching } from './PatternMatching';
import { ModelManager } from './ModelManager';
import { Type, Code, BELAMessage } from './utils/belaMessage';
import * as def from "./default";
import chalk from "chalk";

export class BELA {
  private isModel: boolean = false;
  private packageRoot: string = path.dirname(require.main?.filename ?? process.cwd());
  private trainer: PatternTrainer;
  private matching: PatternMatching;
  private predictor: PatternPredictor;
  private manager: ModelManager;
  private topicPatterns: Map<string, string[]> = new Map([
    ["makanan", ["nasi goreng", "mie ayam", "sate"]],
    ["teknologi", ["AI", "robot", "machine learning"]],
  ]);
  
  private epochs: number;
  private learningRate: number;
  private momentum: number;
  private randomness: number;
  private nGramOrder: number;
  private layers: number[];
  private pathRoot: string;
  private pathModel: string;
  private pathBackup: string;
  private autoIncrement: boolean;
  private autoDelete: boolean;
  private autoDeleteMax: number;

  constructor(config: Configuration = {}) {
    this.epochs = config.parameter?.epochs ?? 5;
    this.learningRate = config.parameter?.learningRate ?? 0.05;
    this.momentum = config.parameter?.momentum ?? 0.9;
    this.randomness = config.parameter?.randomness ?? 0.05;
    this.nGramOrder = config.parameter?.nGramOrder ?? 3;
    this.layers = config.parameter?.layers ?? [64, 32, 16];
    this.pathRoot = config.path?.root ?? "./";
    this.pathModel = config.path?.model ?? "./";
    this.pathBackup = config.path?.backup ?? "./";
    this.autoIncrement = config?.autoIncrement ?? true;
    this.autoDelete = config?.autoDelete ?? true;
    this.autoDeleteMax = config?.autoDeleteMax ?? 10;
    
    this.trainer = new PatternTrainer(this.learningRate, this.nGramOrder, this.momentum, this.layers);
    this.matching = new PatternMatching(this.trainer);
    this.predictor = new PatternPredictor(this.trainer, this.matching, this.randomness);
    this.manager = new ModelManager(
      this.trainer,
      this.epochs,
      this.learningRate,
      this.momentum,
      this.randomness,
      this.nGramOrder,
      this.layers,
      this.packageRoot,
      this.pathRoot,
      this.pathModel,
      this.pathBackup
    );
  }

  train(dataset: Dataset[]): void {
    if (!dataset) {
      throw BELAMessage.say({
        type: Type.ERROR,
        code: Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "Training dataset cannot be empty."
      });
    }
    
    if (!dataset || dataset.length === 0) {
      throw BELAMessage.say({
        type: Type.ERROR,
        code: Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "Training dataset cannot be empty."
      });
    }
    
    if (this.epochs) {
      for (let epoch = 0; epoch < this.epochs; epoch++) {
        if (!Array.isArray(dataset) || !dataset.every(item => typeof item === "object" && item !== null)) {
          throw BELAMessage.say({
            type: Type.ERROR,
            code: Code.GENERAL_NOT_FULFILLED,
            name: "BELA",
            message: "Dataset must be of type array of objects."
          });
        }
      
        try {
          dataset.forEach(({ input, output }) => {
            this.trainer.learnSentence(input);
            this.trainer.learnSentence(output);
            this.trainer.getReverseNGram(input);
            this.trainer.getReverseNGram(output);
            /*this.trainer.learnTopic(input);
            this.trainer.learnTopic(output);*/
            this.trainer.learnBinary(utils.wordToBinary(input), utils.wordToBinary(output));
          });
          BELAMessage.say({
            type: Type.EPOCH,
            code: epoch + 1,
            name: "BELA",
            message: "is complete."
          });
        } catch (err) {
          throw BELAMessage.say({
            type: Type.ERROR,
            code: Code.GENERAL_CORRUPTED_PROBLEM,
            name: "BELA",
            message: "Corrupted training dataset."
          });
        }
      }
    }
    
    this.isModel = true;
  }
  
  fineTune(dataset: Dataset[]): void {
    if (this.manager.currentModel === def.modelData) {
      throw BELAMessage.say({
        type: Type.ERROR,
        code: Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "Model must be loaded before fine-tuning."
      });
    }
    
    if (!dataset || dataset.length === 0) {
      throw BELAMessage.say({
        type: Type.ERROR,
        code: Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "Fine-tuning dataset cannot be empty."
      });
    }
    
    if (this.epochs) {
      for (let epoch = 0; epoch < this.epochs; epoch++) {
        if (!Array.isArray(dataset) || !dataset.every(item => typeof item === "object" && item !== null)) {
          throw BELAMessage.say({
            type: Type.ERROR,
            code: Code.GENERAL_NOT_FULFILLED,
            name: "BELA",
            message: "Dataset must be of type array of objects."
          });
        }
      
        try {
          dataset.forEach(({ input, output }) => {
            this.trainer.learnSentence(input);
            this.trainer.learnSentence(output);
            this.trainer.learnBinary(utils.wordToBinary(input), utils.wordToBinary(output));
          });
          BELAMessage.say({
            type: Type.EPOCH,
            code: epoch + 1,
            name: "BELA",
            message: "is complete."
          });
        } catch (err) {
          throw BELAMessage.say({
            type: Type.ERROR,
            code: Code.GENERAL_CORRUPTED_PROBLEM,
            name: "BELA",
            message: "Corrupted fine-tuning dataset."
          });
        }
      }
    }
    
    const oldModelData: ModelData = this.manager.currentModel;
    
    const newModelData: ModelData = {
      parameters: {
        epochs: this.epochs,
        learningRate: this.learningRate,
        momentum: this.momentum,
        randomness: this.randomness,
        nGramOrder: this.nGramOrder,
        layers: this.layers
      },
      learnedPatterns: Array.from(this.trainer.learnedPatterns.entries()),
      binaryPatterns: Array.from(this.trainer.binaryPatterns.entries()),
      frequentPatterns: Array.from(this.trainer.frequentPatterns),
      reverseNGrams: this.trainer.reverseNGrams,
    };
    
    const mergedModelData: ModelData = {
      parameters: {
        ...oldModelData.parameters,
        ...newModelData.parameters,
      },
      learnedPatterns: Array.from(new Set([
        ...oldModelData.learnedPatterns,
        ...newModelData.learnedPatterns,
      ])),
      binaryPatterns: Array.from(new Set([
        ...oldModelData.binaryPatterns,
        ...newModelData.binaryPatterns,
      ])),
      frequentPatterns: Array.from(new Set([
        ...oldModelData.frequentPatterns,
        ...newModelData.frequentPatterns,
      ])),
      reverseNGrams: {
        ...oldModelData.reverseNGrams,
        ...newModelData.reverseNGrams,
      },
    };
    
    this.trainer.learnedPatterns = new Map(mergedModelData.learnedPatterns);
    this.trainer.binaryPatterns = new Map(mergedModelData.binaryPatterns);
    this.trainer.frequentPatterns = new Set(mergedModelData.frequentPatterns);
    this.trainer.reverseNGrams = mergedModelData.reverseNGrams;
    
    const saveModelPath = path.join(
      this.packageRoot,
      this.pathRoot,
      this.pathModel,
      this.manager.filename
    );
    
    fs.writeFileSync(saveModelPath, utils.lock(mergedModelData, this.manager.password), "utf8");
  }

  info(options: Option = {}): Parameter | ModelData | object {
    console.log(options.parameter);
    if (options.parameter && options.parameter === true) {
      return {
        epochs: this.epochs,
        learningRate: this.learningRate,
        momentum: this.momentum,
        randomness: this.randomness,
        nGramOrder: this.nGramOrder,
        layers: this.layers,
      };
    } else if (options.training && options.training === true) {
      const nextWordsInfo: object[] = [];
      const binaryPatternsInfo: object[] = [];
      const frequentlyPatternsInfo: object[] = [];
      
      for (let [word, data] of this.trainer.learnedPatterns) {
        nextWordsInfo.push({ word: [data.nextWords] });
      }
  
      for (let [inputBinary, data] of this.trainer.binaryPatterns) {
        binaryPatternsInfo.push({ input: inputBinary, output: data.output, frekuensi: data.frequency });
      }
      
      this.trainer.frequentPatterns.forEach(pattern => {
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

  predict(
    question: string,
    options: PredictOption = {
      minLength: 2,
      maxLength: 5,
      maxTest: 3,
      logTest: false,
    }
  ): string {
    if (
      typeof question !== "string" ||
      typeof options.maxLength !== "number" ||
      typeof options.maxTest !== "number" ||
      typeof options.logTest !== "boolean"
      ) {
      throw BELAMessage.say({
        type: Type.ERROR,
        code: Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: `${
          typeof question !== "string" ?
          "Question must be of type string." :
          typeof options.maxLength !== "number" ?
          "maxLength must be of type number." :
          typeof options.maxTest !== "number" ?
          "maxTest must be of type number." :
          "logTest must be of type boolean."
        }`
      });
    }
    
    if (!this.isModel) {
      throw BELAMessage.say({
        type: Type.ERROR,
        code: Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "Model has not been trained or loaded."
      });
    }
    
    if (!question) {
      throw BELAMessage.say({
        type: Type.ERROR,
        code: Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "Prediction questions cannot be empty."
      });
    }
    
    let response: string[] = [];
    for (let test = 0; test < options.maxTest; test++) {
      response = [];
      let words = question.split(" ");
      for (let i = 0; i < words.length; i++) {
        words[i] = utils.wordToBinary(words[i]);
      }
      
      let lastWord = words[words.length - 1]; 
      
      let firstWord = words[0];
      
      let startWord = this.predictor.predictNextWord(lastWord);
      
      if (!startWord || startWord.length <= 1) {  
          startWord = this.predictor.predictPrevWord(firstWord);
      }
      
      if (startWord) response.push(startWord);
  
      let topic: string | null = null;
      for (let [password, values] of this.topicPatterns.entries()) {
          if (values.some(v => question.includes(v))) {
              topic = password;
              break;
          }
      }
  
      if (topic) {
          console.log(`Detected topics: ${topic}`);
      }
  
      for (let i = words.length; i < options.maxLength; i++) {
          let nGrampassword = '';
          if (response && this.nGramOrder) {
              nGrampassword = response.slice(-this.nGramOrder).join(" ");
          }
      
          let nextWord = this.predictor.predictNextWord(nGrampassword);
      
          if (!nextWord) {
              nextWord = this.matching.findClosestWord(nGrampassword) || 
                         this.predictor.predictNextWord(response[response.length - 1]);
          }
      
          if (!nextWord) {
              nextWord = this.predictor.predictPrevWord(response[0]);
          }
      
          if (!nextWord) break;
      
          let windowSize = 3;
          let recentWords = response.slice(-windowSize);
      
          if (recentWords.includes(nextWord)) {
              continue;
          }
      
          response.push(nextWord);
      }
      
      if (options.logTest) {
        BELAMessage.say({
          type: Type.TEST,
          code: test + 1,
          name: "BELA",
          message: response.join(" ")
        });
      }
    }
    
    return response.join(" ");
  }
  
  save(
    name: string,
    options: SaveOption = {
      password: "",
      metadata: def.metadata
    }
  ): void {
    if (!name) {
      throw BELAMessage.say({
        type: Type.ERROR,
        code: Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "File or model name cannot be empty."
      });
    }
    
    if (!options.password) {
      throw BELAMessage.say({
        type: Type.ERROR,
        code: Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "password cannot be empty."
      });
    }
    
    if (this.autoIncrement === false && !name.endsWith('.belamodel')) {
      throw BELAMessage.say({
        type: Type.ERROR,
        code: Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "File names do not end in .belamodel."
      });
    }
    
    if (this.autoDelete) {
      this.manager.save(
        name,
        utils.getFullEnv(options.password),
        this.autoDeleteMax ?? 10,
        true,
        options.metadata
      );
      return;
    }
    
    this.manager.save(
      name, 
      utils.getFullEnv(options.password), 
      this.autoDeleteMax ?? 10, 
      false, 
      options.metadata
    );
  }
  
  load(
    name: string,
    options: LoadOption = {
      password: ""
    }
  ): void {
    if (!name) {
      throw BELAMessage.say({
        type: Type.ERROR,
        code: Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "File or model name cannot be empty."
      });
    }
    
    if (!options.password) {
      throw BELAMessage.say({
        type: Type.ERROR,
        code: Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "password cannot be empty."
      });
    }
    
    if (this.autoIncrement === false && !name.endsWith('.belamodel')) {
      throw BELAMessage.say({
        type: Type.ERROR,
        code: Code.GENERAL_NOT_FULFILLED,
        name: "BELA",
        message: "File names do not end in .belamodel."
      });
    }
    
    const data: ModelData = this.manager.load(
      name, 
      utils.getFullEnv(options.password)
    );

    if (!data || !data.parameters) {
      throw BELAMessage.say({
        type: Type.ERROR,
        code: Code.INTERNAL_NOT_FULFILLED,
        name: "BELA",
        message: this.autoIncrement ? `Failed to read model data with name ${name}.` : `Failed to read data model from file named ${name}.`
      });
    }
    
    this.epochs = data.parameters.epochs as number;
    this.learningRate = data.parameters.learningRate as number;
    this.momentum = data.parameters.momentum as number;
    this.randomness = data.parameters.randomness as number;
    this.nGramOrder = data.parameters.nGramOrder as number;
    this.layers = data.parameters.layers as number[];
    
    this.isModel = true;
  }
  
  move(
    from: string,
    fromOptions: FromOption = {
      password: ""
    },
    to: string,
    toOptions: ToOption = {
      password: ""
    }
  ): void {
    this.manager.move(
      from,
      fromOptions.password,
      to,
      toOptions.password
    );
  }
  
  read(
    name: string,
    options: ReadOption = {
      password: ""
    }
  ): ModelData {
    return this.manager.read(
      name,
      options.password
    );
  }
}