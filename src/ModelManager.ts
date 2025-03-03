import { PatternTrainer } from './PatternTrainer';
import * as utils from './utils/utils';
import {
  Parameter,
  ModelData
} from './types/types';
import * as fs from 'fs';
import * as path from 'path';

export class ModelManager {
  public currentModel = {};
  public filename = "";
  public key = "";
  
  constructor(
    private trainer: PatternTrainer,
    private epochs: number,
    private learningRate: number,
    private momentum: number,
    private randomness: number,
    private nGramOrder: number,
    private layers: number[],
    private packageRoot: string,
    private pathRoot: string,
    private pathModel: string,
    private pathBackup: string,
  ) {}
  
  save(filename: string, key: string): void {
    const modelPath = path.join(this.packageRoot, this.pathRoot, this.pathModel, filename);
    const backupPath = path.join(this.packageRoot, this.pathRoot, this.pathBackup, filename.replace(".belamodel", ".belamodel.backup"));
    
    const modelData: ModelData = {
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
    };

    fs.writeFileSync(modelPath, utils.encode(modelData, key), 'utf8');
    fs.writeFileSync(backupPath, utils.encode(modelData, key), 'utf8');
    console.log("Model successfully saved.");
  }
  
  load(filename: string, key: string): ModelData {
    this.filename = filename;
    this.key = key;
    const modelPath = path.join(this.packageRoot, this.pathRoot, this.pathModel, filename);
    
    const modelData: ModelData = utils.decode(fs.readFileSync(modelPath, 'utf8'), key);
    this.currentModel = modelData;
    this.trainer.learnedPatterns = new Map(modelData.learnedPatterns);
    this.trainer.binaryPatterns = new Map(modelData.binaryPatterns);
    this.trainer.frequentPatterns = new Set(modelData.frequentPatterns);
    
    console.log("Model loaded successfully.");
    
    return modelData;
  }
}