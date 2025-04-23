<div style="display: flex; flex-wrap: wrap; gap: 5px;">
  <img src="https://img.shields.io/badge/Node.js-12%2B-green?logo=node.js&style=flat-square">
  <a href="https://github.com/soteenstudio/bela/blob/main/LICENSE.txt"><img src="https://img.shields.io/github/license/soteenstudio/bela?style=flat-square"></a>
  <a href="https://npmjs.org/package/@soteen/bela"><img src="https://img.shields.io/npm/v/@soteen/bela?style=flat-square"></a>
  <img src="https://img.shields.io/npm/dt/@soteen/bela?style=flat-square">
  <img src="https://img.shields.io/github/repo-size/soteenstudio/bela?style=flat-square">
  <img src="https://img.shields.io/github/contributors/soteenstudio/bela?style=flat-square">
  <img src="https://img.shields.io/github/stars/soteenstudio/bela?style=flat-square">
  <a href="https://github.com/soteenstudio/bela/issues"><img src="https://img.shields.io/github/issues/soteenstudio/bela?style=flat-square"></a>
</div>

![Banner](banner.jpg)

BELA is an AI architecture that represents text using binary, leverages entropy for learning, and two-way prediction to create response.

BELA itself stands for **Binary Entropy Learning Architecture**.

## Tutorials
If you want to learn how to install and use BELA, you can follow the tutorial we provide.
### Installation
You can install BELA using npm with this command.
```sh
npm install @soteen/bela
```
### Next steps after installation
Here's a quick setup to start training your own AI model with BELA.
1. **Creating a configuration**:

    You need a configuration to configure the model you want to create.
    ```json5
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
      },
      "autoIncrement": true, // Automatic upgrade
      "autoDelete": true, // Delete old versions automatically
      "autoDeleteMax": 2 // Number of versions stored, oldest will be deleted
    }
    ```
2. **Creating a dataset**:

    Before proceeding to the next step, you need to create a dataset as follows.
    ```json5
    [
      { "input": "Hey, how are you?", "output": "I'm fine, thank you?"},
      { "input": "Tell me about the story", "output": "Sure! I'll tell you about the story" }
    ]
    ```
3. **Use the code examples**:  
After installing, creating configurations, and creating datasets. You can run the following codes.

    3.1. **Import** ``@soteen/bela`` **to the project**:
    ```javascript
    import { BELA } from "@soteen/bela";
    ```
    3.2. **Initialize BELA with the configuration**:
    ```javascript
    const model = new BELA(config);
    ```
    3.3. **Train the model with the dataset**:
    ```javascript
    model.train(dataset);
    ```
    3.4. **Save the trained model**:
    ```javascript
    /** No auto-increment */
    model.save("model.belamodel", {
      password: password
    });
    
    /** With auto-increment */
    model.save("model", {
      password: password
    });
    ```
    3.5. **Load the trained model**:
    ```javascript
    /** No auto-increment */
    model.load("model.belamodel", {
      password: password
    });
    
    /** With auto-increment */
    model.load("model", {
      password: password
    });
    ```
    3.6. **Move model to new/other file**:
    ```javascript
    /** No auto-increment */
    model.move("old-model.belamodel", {
      password: oldPassword
    },
    "new-model.belamodel", {
      password: newPassword
    });
    
    /** With auto-increment */
    model.move("old-model", {
      password: oldPassword
    },
    "new-model", {
      password: newPassword
    });
    ```
    3.7. **Read the contents of the** ``.belamodel`` **file**:
    ```javascript
    /** No auto-increment */
    console.log(model.read("model.belamodel", {
      password: password
    }));
    
    /** With auto-increment */
    console.log(model.read("model", {
      password: password
    }));
    ```
    3.8. **Make a prediction**:
    ```javascript
    const predict = model.predict("Say this is example code.", {
      maxLength: 12,
      maxTest: 5,
      logTest: true
    });
    
    console.log(predict);
    ```

    > [!CAUTION]
    > We recommend that you store your configuration in a JSON file and your model password in a .env file.

## Installation Performance
From version to version, BELA has installation differences that we can see in the following table.
| Version    | Size    | Performance | Optimizations performed |
|------------|---------|-------------|-------------------------|
| v0.0.4-dev | 64.62kB | 5s          | Build and minify using [esbuild](https://github.com/evanw/esbuild) |
| v0.0.3-dev | 69.25kB | 4-8s        | Deleting .js.map files |
| v0.0.2-dev | 83.09kB | 4-8s        | Nothing |
| v0.0.1-dev | 83.16kB | 4-8s        | Nothing |

This data is obtained by extracting the .tgz file from each version, after which its size is obtained through the process of checking the size of its folder. This data does not include the dependencies.

## Contribute
If you haven't contributed yet, you should read how to [contribute](CONTRIBUTING.md) to this project.

## Roadmap
This project has several roadmaps that we have achieved and have not achieved.

- [x] Compatible with [CommonJS](https://nodejs.org/api/modules.html) and [ES Modules](https://nodejs.org/api/esm.html).
- [x] Introducing the ``move()`` feature.
- [x] Introducing the ``read()`` feature.
- [x] Introducing the ``fineTune()`` feature.
- [x] Introducing the security of the ``.belamodel`` feature.  
[And others...](https://github.com/soteenstudio/bela/blob/main/Roadmap.md)
