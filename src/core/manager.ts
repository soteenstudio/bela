import { Trainer } from './trainer';
import * as utils from '../utils';
import * as fs from 'fs';
import * as path from 'path';
import * as def from "../default";
import { Layer, Dense, BatchNorm } from "./neuralNet/";

export class Manager {
  public currentModel: ModelData = def.modelData;
  public filename: string = "";
  public password: string = "";
  
  constructor(
    private trainer: Trainer,
    private epochs: number,
    private learningRate: number,
    private batchSize: number,
    private layers: Layer[],
    private temp: number,
    private topP: number,
    private packageRoot: string,
    private pathRoot: string,
    private pathModel: string,
    private pathBackup: string,
  ) {}
  
  async save(
    modelName: string,
    password: string,
    maxFile: number,
    autoDelete: boolean,
    metadata?: Metadata
  ): Promise<void> {
    const trained = this.trainer.getLayers();
    const modelData: ModelData = {
      metadata,
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
      },
      model: trained.map((t: any) => t.toJSON())
    };
    
    const saveFilename = await utils.incrementBelamodel(path.join(this.packageRoot, this.pathModel), modelName, modelData, password);
    const saveModelPath = path.join(this.packageRoot, this.pathRoot, this.pathModel, saveFilename);
    
    this.filename = saveFilename ?? "/";
    
    const modelNumber: string | null = utils.getModelNumber(this.filename, modelName);
    
    if (fs.existsSync(saveModelPath)) {
      utils.BELAMessage.say({
        type: utils.Type.SUCCESS,
        code: utils.Code.SUCCESS_ALREADY_EXISTS,
        name: "BELA",
        message: `Model with name _*${modelName}*_ and version _*${modelNumber}*_ already exists.`
      });
      return;
    }

    fs.writeFileSync(saveModelPath, await utils.secure(modelData, password, modelName), 'utf8');
    
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
    
    utils.BELAMessage.say({
      type: utils.Type.SUCCESS,
      code: utils.Code.SUCCESS_TAKE_ACTION,
      name: "BELA",
      message: `Successfully saved model with name _*${modelName}*_ and version _*${modelNumber}*_.`
    });
  }
  
  async load(
    modelName: string,
    password: string
  ): Promise<ModelData> {
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
      modelData = await utils.desecure(
        fs.readFileSync(
          modelPath,
          'utf8'
        ),
        password,
        modelName
      );
      
      modelData.model.forEach((model: any) => {
        if (model.type === "Dense") {
          const dense = Dense.fromJSON(model);
          
          this.trainer.layers.push(dense);
        } else if (model.type === "BatchNorm") {
          const batchNorm = BatchNorm.fromJSON(model);
          
          this.trainer.layers.push(batchNorm);
        }
      });
      
      const modelNumber: string | null = utils.getModelNumber(
        this.filename,
        modelName
      );
      
      utils.BELAMessage.say({
        type: utils.Type.SUCCESS,
        code: utils.Code.SUCCESS_TAKE_ACTION,
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
        throw utils.BELAMessage.say({
          type: utils.Type.ERROR,
          code: utils.Code.GENERAL_NOT_FOUND,
          name: "BELA",
          message: `Model with name _*${modelName}*_ not found.`,
          stack: `  • Found model with name _*${similarFile}*_.\n  • Did you mean _*${similarFile}*_?`
        });
      } else {
        throw utils.BELAMessage.say({
          type: utils.Type.ERROR,
          code: utils.Code.GENERAL_NOT_FOUND,
          name: "BELA",
          message: `Model with name _*${modelName}*_ not found.`,
          stack: `  • No similar model found.`
        });
      }
    }
    
    return modelData ?? def.modelData;
  }
  
  async move(
    modelName1: string,
    password1: string,
    modelName2: string,
    password2: string
  ): Promise<void> {
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
      modelData = await utils.desecure(
        fs.readFileSync(
          modelPath,
          'utf8'
        ),
        password1,
        modelName1
      );
      
      const saveFilename = await utils.incrementBelamodel(
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
              utils.BELAMessage.say({
                type: utils.Type.SUCCESS,
                code: utils.Code.SUCCESS_ALREADY_EXISTS,
                name: "BELA",
                message: `Model with name _*${modelName2}*_ and version _*${modelNumber2}*_ already exists.`
              });
              return;
            }
            
            if (modelData) fs.writeFileSync(
              saveModelPath,
              await utils.secure(
                modelData,
                password2,
                modelName2
              ),
              'utf8'
            );
            
            utils.BELAMessage.say({
              type: utils.Type.SUCCESS,
              code: utils.Code.SUCCESS_TAKE_ACTION,
              name: "BELA",
              message: `Successfully moved model with name _*${modelName1}*_ and version _*${modelNumber1}*_ to a new model with name _*${modelName2}*_ and version _*${modelNumber2}*_.`
            });
          }
        })();
      } else {
        if (fs.existsSync(saveModelPath)) {
          utils.BELAMessage.say({
            type: utils.Type.SUCCESS,
            code: utils.Code.SUCCESS_ALREADY_EXISTS,
            name: "BELA",
            message: `Model with name _*${modelName2}*_ and version _*${modelNumber2}*_ already exists.`
          });
          return;
        }
        
        if (modelData) fs.writeFileSync(
          saveModelPath,
          await utils.secure(
            modelData,
            password2,
            modelName2
          ),
          'utf8'
        );
        
        utils.BELAMessage.say({
          type: utils.Type.SUCCESS,
          code: utils.Code.SUCCESS_TAKE_ACTION,
          name: "BELA",
          message: `Successfully moved model with name _*${modelName1}*_ and version _*${modelNumber1}*_ to a new model with name _*${modelName2}*_ and version _*${modelNumber2}*_.`
        });
      }
    }
  }
  
  async read(
    modelName: string,
    password: string
  ): Promise<ModelData> {
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
      modelData = await utils.desecure(
        fs.readFileSync(
          modelPath,
          'utf8'
        ),
        password,
        modelName
      );
      return modelData;
    }
    
    return def.modelData;
  }
}