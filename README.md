# BELA: Binary Entropy Learning Architecture for AI Models
BELA is an AI architecture that represents text using binary and leverages entropy for learning.
BELA itself stands for **Binary Entropy Learning Architecture**.
## Who can use BELA?
Anyone! Whether you're an AI researcher or just experimenting, you can use BELA to create your own models.
### How to install?
You can install BELA using npm with this command:
```sh
npm install @soteen/bela
```
### What are the steps after installation?
Here's a quick setup to start training your own AI model with BELA.
1. **config.json**:
```json
{
  "parameter": {
    "epochs": 5, // Number of training iterations
    "learningRate": 0.05, // Learning rate for optimization
    "nGramOrder": 3, // Context window size for text processing
    "layers": [64, 32, 16] // Neural network layer sizes
  },
  "path": {
    "root": "./", // Base directory
    "model": "./models/", // Model storage path
    "backup": "./backup/" // Backup directory
  }
}
```
2. **index.js**:
```javascript
/** Import all required modules */
import { BELA } from '@soteen/bela';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

/** Set dotenv module */
dotenv.config();

/** Get the configuration from the config.json file */
const config = JSON.parse(fs.readFileSync("./config.json", "utf8"));

/** Initialize BELA with configuration from config.json file */
const model = new BELA(config);

/** Get the data you want to use to train the model from dataset.json */
const trainingData = JSON.parse(fs.readFileSync("dataset.json", "utf8"));

/** Train the model with data taken from dataset.json */
model.train(trainingData);

/** Get password from .env file */
const password = process.env.PASSWORD;

/** Save the trained model */
model.save("model.belamodel", password);

/** Load the trained model */
model.load("model.belamodel", password);

/** Make a prediction */
const predict = model.predict("hello", { maxLength: 12 });
console.log(predict);
```

> **Caution**: We recommend that you store your configuration in a JSON file and your model password in a .env file.