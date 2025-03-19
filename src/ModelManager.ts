import { PatternTrainer } from './PatternTrainer';
import { BELAMessage } from './utils/belaMessage';
import * as utils from './utils';
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
  
  save(modelName: string, key: string, maxFile: number, autoDelete: boolean): void {
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
    
    const saveFilename = utils.incrementBelamodel(path.join(this.packageRoot, this.pathModel), modelName, modelData, key);
    const saveModelPath = path.join(this.packageRoot, this.pathRoot, this.pathModel, saveFilename);
    
    this.filename = saveFilename;
    
    const modelNumber: string | null = utils.getModelNumber(this.filename, modelName);
    
    if (fs.existsSync(saveModelPath)) {
      BELAMessage.say({
        type: "success",
        code: 204,
        name: "BELA",
        message: `Model with name _*${modelName}*_ and version _*${modelNumber}*_ already exists.`
      });
      return;
    }

    fs.writeFileSync(saveModelPath, utils.lock(modelData, key), 'utf8');
    
    if (autoDelete) {
      const deleteFilename = utils.deleteBelamodel(path.join(this.packageRoot, this.pathModel), modelName, maxFile);
      if (deleteFilename) {
        const deleteModelPath = path.join(this.packageRoot, this.pathRoot, this.pathModel, deleteFilename);
        fs.unlinkSync(deleteModelPath);
      }
    }
    
    BELAMessage.say({
      type: "success",
      code: 201,
      name: "BELA",
      message: `Successfully saved model with name _*${modelName}*_ and version _*${modelNumber}*_.`
    })
  }
  
  load(modelName: string, key: string): ModelData | undefined {
    this.filename = utils.getLatestBelamodel(path.join(this.packageRoot, this.pathModel), modelName) ?? "";
    this.key = key;
    
    const modelPath = path.join(this.packageRoot, this.pathRoot, this.pathModel, this.filename);
    
    let modelData: ModelData | undefined = undefined;
    if (this.filename !== "") {
      modelData = utils.unlock(fs.readFileSync(modelPath, 'utf8'), key);
      this.currentModel = modelData;
      this.trainer.learnedPatterns = new Map(modelData.learnedPatterns);
      this.trainer.binaryPatterns = new Map(modelData.binaryPatterns);
      this.trainer.frequentPatterns = new Set(modelData.frequentPatterns);
      
      const modelNumber: string | null = utils.getModelNumber(this.filename, modelName);
      
      BELAMessage.say({
        type: "success",
        code: 200,
        name: "BELA",
        message: `Successfully loaded model with name _*${modelName}*_ and version _*${modelNumber}*_.`
      })
    } else {
      const similarFile = utils.findSimilarFile(path.join(this.packageRoot, this.pathModel), modelName);
      
      if (similarFile) {
        BELAMessage.say({
          type: "error",
          code: 404,
          name: "BELA",
          message: `Model with name _*${modelName}*_ not found.`,
          stack: `  • Found model with name _*${similarFile}*_.\n  • Did you mean _*${similarFile}*_?`
        });
      } else {
        BELAMessage.say({
          type: "error",
          code: 404,
          name: "BELA",
          message: `Model with name _*${modelName}*_ not found.`,
          stack: `  • No similar model found.`
        });
      }
    }
    
    return modelData;
  }
}