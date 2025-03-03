import { BELA } from '@soteen/bela';
import * as fs from 'fs';

const Coucou = new BELA({
  parameter: {
    epochs: 20,
    learningRate: 0.05,
    nGramOrder: 5,
    layers: [256, 128, 64],
  }
});

Coucou.load('./model.belamodel', 'PasswordPasswordPasswordPassword');
/*Coucou.fineTune([
  { input: "apa itu kontol", output: "kontol adalah kelamin pria" }
]);*/
console.log(Coucou.predict('kontol', 12));
Coucou.info({ training: true })