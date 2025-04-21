import { PatternTrainer } from './PatternTrainer';
import { Type, Code, BELAMessage } from './utils/belaMessage';
import * as utils from './utils';
import * as fs from 'fs';
import * as path from 'path';
import * as def from "./default";

export class ModelManager {
  public currentModel: ModelData = def.modelData;
  public filename: string = "";
  public password: string = "";
  
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
  
  save(
    modelName: string,
    password: string,
    maxFile: number,
    autoDelete: boolean,
    metadata?: Metadata
  ): void {
    const modelData: ModelData = {
      metadata,
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
    
    const saveFilename = utils.incrementBelamodel(path.join(this.packageRoot, this.pathModel), modelName, modelData, password);
    const saveModelPath = path.join(this.packageRoot, this.pathRoot, this.pathModel, saveFilename);
    
    this.filename = saveFilename ?? "/";
    
    const modelNumber: string | null = utils.getModelNumber(this.filename, modelName);
    
    if (fs.existsSync(saveModelPath)) {
      BELAMessage.say({
        type: Type.SUCCESS,
        code: Code.SUCCESS_ALREADY_EXISTS,
        name: "BELA",
        message: `Model with name _*${modelName}*_ and version _*${modelNumber}*_ already exists.`
      });
      return;
    }

    fs.writeFileSync(saveModelPath, utils.lock(modelData, password, modelName), 'utf8');
    
    if (autoDelete) {
      const deleteFilename = utils.deleteBelamodel(
        path.join(
          this.packageRoot,
          this.pathModel
        ),
        modelName,
        maxFile
      );
      if (deleteFilename) {
        const deleteModelPath = path.join(
          this.packageRoot, 
          this.pathRoot, 
          this.pathModel, 
          deleteFilename
        );
        fs.unlinkSync(deleteModelPath);
      }
    }
    
    BELAMessage.say({
      type: Type.SUCCESS,
      code: Code.SUCCESS_TAKE_ACTION,
      name: "BELA",
      message: `Successfully saved model with name _*${modelName}*_ and version _*${modelNumber}*_.`
    });
  }
  
  load(
    modelName: string,
    password: string
  ): ModelData {
    this.filename = utils.getLatestBelamodel(
      path.join(
        this.packageRoot,
        this.pathModel
      ),
      modelName
    ) ?? "";
    this.password = password;
    
    const modelPath = path.join(
      this.packageRoot,
      this.pathRoot,
      this.pathModel,
      this.filename
    );
    
    let modelData: ModelData | undefined = undefined;
    if (this.filename !== "") {
      modelData = utils.unlock(
        fs.readFileSync(
          modelPath,
          'utf8'
        ),
        password,
        modelName
      );
      this.currentModel = modelData;
      this.trainer.learnedPatterns = new Map(modelData.learnedPatterns);
      this.trainer.binaryPatterns = new Map(modelData.binaryPatterns);
      this.trainer.frequentPatterns = new Set(modelData.frequentPatterns);
      this.trainer.reverseNGrams = modelData.reverseNGrams;
      
      const modelNumber: string | null = utils.getModelNumber(
        this.filename,
        modelName
      );
      
      BELAMessage.say({
        type: Type.SUCCESS,
        code: Code.SUCCESS_TAKE_ACTION,
        name: "BELA",
        message: `Successfully loaded model with name _*${modelName}*_ and version _*${modelNumber}*_.`
      })
    } else {
      const similarFile = utils.findSimilarFile(
        path.join(
          this.packageRoot,
          this.pathModel
        ),
        modelName)?.replace(/\-(\d+)\.belamodel/g, "");
      
      if (similarFile) {
        throw BELAMessage.say({
          type: Type.ERROR,
          code: Code.GENERAL_NOT_FOUND,
          name: "BELA",
          message: `Model with name _*${modelName}*_ not found.`,
          stack: `  • Found model with name _*${similarFile}*_.\n  • Did you mean _*${similarFile}*_?`
        });
      } else {
        throw BELAMessage.say({
          type: Type.ERROR,
          code: Code.GENERAL_NOT_FOUND,
          name: "BELA",
          message: `Model with name _*${modelName}*_ not found.`,
          stack: `  • No similar model found.`
        });
      }
    }
    
    return modelData ?? def.modelData;
  }
  
  move(
    modelName1: string,
    password1: string,
    modelName2: string,
    password2: string
  ): void {
    this.filename = utils.getLatestBelamodel(
      path.join(
        this.packageRoot,
        this.pathModel
      ),
      modelName1
    ) ?? "";
    
    const modelPath = path.join(
      this.packageRoot,
      this.pathRoot,
      this.pathModel,
      this.filename
    );
    
    let modelData: ModelData | undefined = undefined;
    if (this.filename !== "") {
      modelData = utils.unlock(
        fs.readFileSync(
          modelPath,
          'utf8'
        ),
        password1,
        modelName1
      );
      
      const saveFilename = utils.incrementBelamodel(
        path.join(
          this.packageRoot,
          this.pathModel
        ),
        modelName2, 
        modelData, 
        password2
      );
      
      const saveModelPath = path.join(
        this.packageRoot,
        this.pathRoot,
        this.pathModel, 
        saveFilename
      );
      
      const modelNumber1: string | null = utils.getModelNumber(this.filename, modelName1);
      const modelNumber2: string | null = utils.getModelNumber(saveFilename, modelName2);
      
      if (modelName1 === modelName2) {
        (async () => {
          const confirm = await utils.question("Are you sure you want to overwrite the model file with its own data?");
          
          if (confirm) {
            if (fs.existsSync(saveModelPath)) {
              BELAMessage.say({
                type: Type.SUCCESS,
                code: Code.SUCCESS_ALREADY_EXISTS,
                name: "BELA",
                message: `Model with name _*${modelName2}*_ and version _*${modelNumber2}*_ already exists.`
              });
              return;
            }
            
            if (modelData) fs.writeFileSync(
              saveModelPath,
              utils.lock(
                modelData,
                password2,
                modelName2
              ),
              'utf8'
            );
            
            BELAMessage.say({
              type: Type.SUCCESS,
              code: Code.SUCCESS_TAKE_ACTION,
              name: "BELA",
              message: `Successfully moved model with name _*${modelName1}*_ and version _*${modelNumber1}*_ to a new model with name _*${modelName2}*_ and version _*${modelNumber2}*_.`
            });
          }
        })();
      } else {
        if (fs.existsSync(saveModelPath)) {
          BELAMessage.say({
            type: Type.SUCCESS,
            code: Code.SUCCESS_ALREADY_EXISTS,
            name: "BELA",
            message: `Model with name _*${modelName2}*_ and version _*${modelNumber2}*_ already exists.`
          });
          return;
        }
        
        if (modelData) fs.writeFileSync(
          saveModelPath,
          utils.lock(
            modelData,
            password2,
            modelName2
          ),
          'utf8'
        );
        
        BELAMessage.say({
          type: Type.SUCCESS,
          code: Code.SUCCESS_TAKE_ACTION,
          name: "BELA",
          message: `Successfully moved model with name _*${modelName1}*_ and version _*${modelNumber1}*_ to a new model with name _*${modelName2}*_ and version _*${modelNumber2}*_.`
        });
      }
    }
  }
  
  read(modelName: string, password: string): ModelData {
    this.filename = utils.getLatestBelamodel(
      path.join(
        this.packageRoot,
        this.pathModel
      ),
      modelName
    ) ?? "";
    this.password = password;
    
    const modelPath = path.join(
      this.packageRoot,
      this.pathRoot,
      this.pathModel,
      this.filename
    );
    
    let modelData: ModelData | undefined = undefined;
    if (this.filename !== "") {
      modelData = utils.unlock(
        fs.readFileSync(modelPath, 'utf8'),
        password,
        modelName
      );
      return modelData;
    }
    
    return def.modelData;
  }
}