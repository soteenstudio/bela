# BELA
What is BELA? Bela is any **artificial intelligence architecture** that uses binary as a representation of text and uses entropy, BELA itself stands for **Binary Entropy Learning Architecture**.
## Can I use this architecture?
Yes of course. You can use this architecture to create your own models.
### How to install?
To install this architecture you need Node.js 12 and above. If you already have the required Node.js, then you can run the following command:
```sh
npm install @soteen/bela
```
### What are the steps after installation?
Once you have successfully installed this architecture, you can copy the following code template to create your model.
1. **config.json**:
```json
{
  "parameter": {
    "epochs": 20,
    "learningRate": 0.05,
    "nGramOrder": 5,
    "layers": [256, 128, 64]
  },
  "path": {
    "root": "./",
    "model": "./models/",
    "backup": "./backup/"
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
const config = JSON.parse(fs.readFileSync('./config.json', 'utf8'));

/** Initialize BELA with configuration from config.json file */
const Coucou = new BELA(config);

/** Get the data you want to use to train the model from dataset.json */
const trainingData = JSON.parse(fs.readFileSync('dataset.json', 'utf8'));

/** Train the model with data taken from dataset.json */
Coucou.train(trainingData);

/** Get password from .env file */
const password = process.env.PASSWORD;

/** Save the trained model */
for (let i = 0; i < 5; i++) {
  if (password && password?.length === 32) {
    Coucou.save('coucou.belamodel', password);
    break;
  }
}
```

> **Caution**: We recommend that you store your configuration in a JSON file and your model password in a .env file.