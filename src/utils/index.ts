/*  
 * Copyright 2025 SoTeen Studio  
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");  
 * you may not use this file except in compliance with the License.  
 * You may obtain a copy of the License at  
 *  
 *     http://www.apache.org/licenses/LICENSE-2.0  
 */
 
/** Security */
export { secure } from "./security/secure";
export { desecure } from "./security/desecure";

/** Data */
export {
  setVocab,
  SPECIAL_TOKENS
} from "./data/vocab/setVocab";

/** Manager */
export { incrementBelamodel } from "./manager/incrementBelamodel";
export { deleteBelamodel } from "./manager/deleteBelamodel";
export { getLatestBelamodel } from "./manager/getLatestBelamodel";
export { getModelNumber } from "./manager/getModelNumber";
export { findSimilarFile } from "./manager/findSimilarFile";

/** Math */
export { dot } from "./math/dot";
export { cosine } from "./math/cosine";

/** String */
export { padChar } from "./string/padChar";
export { capitalizeWords } from "./string/capitalizeWords";

/** Message */
export {
  Type,
  Code,
  BELAMessage
} from "./message/belaMessage";
export { question } from "./message/question";

/** Preprocess */
export { preprocessDataset } from "./preprocess/preprocessDataset";
export { preprocessUserText } from "./preprocess/preprocessUserText";
export { wordToBinary } from "./preprocess/encoding/wordToBinary";
export { wordToToken } from "./preprocess/encoding/wordToToken";
export { sentenceToVectors } from "./preprocess/encoding/sentenceToVectors";
export { tokenize } from "./preprocess/encoding/tokenize";
export { vectorize } from "./preprocess/encoding/vectorize";

/** Postprocess */
export { postProcess } from "./postprocess//postProcess";
export { binaryToWord } from "./postprocess/decoding/binaryToWord";
export { tokenToWord } from "./postprocess/decoding/tokenToWord";
export { vectorsToSentence } from "./postprocess/decoding/vectorsToSentence";
export { detokenize } from "./postprocess/decoding/detokenize";
export { devectorize } from "./postprocess/decoding/devectorize";

/** Crypto */
export { encrypt } from "./crypto/encrypt";
export { decrypt } from "./crypto/decrypt";
export { generateChecksum } from "./crypto/generateChecksum";
export { streamHash } from "./crypto/streamHash";
export { generateCode } from "./crypto/generateCode";

/** Validators */
export { isValidCode } from "./validators/isValidCode";
export { isStringArray } from "./validators/isStringArray";
export { isValidBinary } from "./validators/isValidBinary";
export { isConversationDataset } from "./validators/isConversationDataset";
export { isImageDataset } from "./validators/isImageDataset";