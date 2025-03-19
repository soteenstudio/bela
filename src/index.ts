import * as utils from './utils';
import * as fs from 'fs';
import * as path from 'path'
import { PatternTrainer } from './PatternTrainer';
import { PatternPredictor } from './PatternPredictor';
import { PatternMatching } from './PatternMatching';
import { ModelManager } from './ModelManager';
import { BELAMessage } from './utils/belaMessage';

export class BELA {
  private packageRoot: string = path.dirname(require.main?.filename ?? process.cwd());
  private trainer: PatternTrainer;
  private matching: PatternMatching;
  private predictor: PatternPredictor;
  private manager: ModelManager;
  private topicPatterns: Map<string, string[]> = new Map([
    ["makanan", ["nasi goreng", "mie ayam", "sate"]],
    ["teknologi", ["AI", "robot", "machine learning"]],
  ]);
  
  private epochs?: number;
  private learningRate?: number;
  private momentum?: number;
  private randomness?: number;
  private nGramOrder?: number;
  private layers?: number[];
  private pathRoot?: string;
  private pathModel?: string;
  private pathBackup?: string;
  private autoIncrement?: boolean;
  private autoDelete?: boolean;
  private autoDeleteMax?: number;

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
    if (this.epochs) {
      for (let epoch = 0; epoch < this.epochs; epoch++) {
        dataset.forEach(({ input, output }) => {
          this.trainer.learnSentence(input);
          this.trainer.learnBinary(utils.wordToBinary(input), utils.wordToBinary(output));
        });
        console.log(`Epoch ${epoch + 1} is complete.`);
      }
    }
  }
  
  fineTune(dataset: Dataset[]): void {
    const modelData1 = this.manager.currentModel;
    
    if (this.epochs) {
      for (let epoch = 0; epoch < this.epochs; epoch++) {
        dataset.forEach(({ input, output }) => {
          this.trainer.learnSentence(input);
          this.trainer.learnBinary(utils.wordToBinary(input), utils.wordToBinary(output));
        });
        console.log(`Epoch ${epoch + 1} is complete.`);
      }
    }
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

  predict(question: string, maxLength: number): string {
      let words = question.split(" ");
      let response = [...words];
  
      let topic: string | null = null;
      for (let [key, values] of this.topicPatterns.entries()) {
          if (values.some(v => question.includes(v))) {
              topic = key;
              break;
          }
      }
  
      if (topic) {
          console.log(`Detected topics: ${topic}`);
      }
  
      for (let i = words.length; i < maxLength; i++) {
          let nGramKey = '';
          if (response && this.nGramOrder) {
            nGramKey = response.slice(-this.nGramOrder).join(" ");
          }
          let nextWord = this.predictor.predictNextWord(nGramKey);
  
          if (!nextWord) {
              nextWord = this.matching.findClosestWord(nGramKey) || 
                         this.predictor.predictNextWord(response[response.length - 1]);
          }
  
          if (!nextWord) break;
          response.push(nextWord);
      }
  
      return response.join(" ");
  }
  
  save(filename: string, key: string): void {
    if (!filename) {
      BELAMessage.say({
        type: "error",
        code: 400,
        name: "BELA",
        message: "File name cannot be empty."
      });
    }
    
    if (!key) {
      BELAMessage.say({
        type: "error",
        code: 400,
        name: "BELA",
        message: "Key cannot be empty."
      });
    }
    
    if (this.autoIncrement === false && !filename.endsWith('.belamodel')) {
      BELAMessage.say({
        type: "error",
        code: 415,
        name: "BELA",
        message: "File names do not end in .belamodel."
      });
    }
    
    if (this.autoDelete) {
      this.manager.save(filename, utils.getFullEnv(key), this.autoDeleteMax ?? 10, true);
      return;
    }
    
    this.manager.save(filename, utils.getFullEnv(key), this.autoDeleteMax ?? 10, false);
  }
  
  load(filename: string, key: string): void {
    if (!filename) {
      BELAMessage.say({
        type: "error",
        code: 400,
        name: "BELA",
        message: "File name cannot be empty."
      });
    }
    
    if (!key) {
      BELAMessage.say({
        type: "error",
        code: 400,
        name: "BELA",
        message: "Key cannot be empty."
      });
    }
    
    if (this.autoIncrement === false && !filename.endsWith('.belamodel')) {
      BELAMessage.say({
        type: "error",
        code: 415,
        name: "BELA",
        message: "File names do not end in .belamodel."
      });
    }
    
    const data = this.manager.load(filename, utils.getFullEnv(key));
    this.epochs = data?.parameters.epochs;
    this.learningRate = data?.parameters.learningRate;
    this.momentum = data?.parameters.momentum;
    this.randomness = data?.parameters.randomness;
    this.nGramOrder = data?.parameters.nGramOrder;
    this.layers = data?.parameters.layers;
  }
}