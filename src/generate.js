import loadArray, { SYMBOL_END, SYMBOL_START } from "./load.js";

const MAX_LENGTH = 40;

/**
 * Generate a sentence based on the markov chain data provided.
 *
 * @param {Map<string | symbol, string[]>} map Chain data.
 * @param {GenerateOptions} [options] Options to influence how data is generated.
 */
export default function generate(map, options = {}) {
  let shouldStopASAP = false;

  /**
   * @type {symbol | string | undefined}
   */
  let currentWord = options.start ?? SYMBOL_START;
  let currentData;
  if (currentWord === SYMBOL_START) updateCurrentData();

  const sentence = [];

  function updateCurrentData() {
    /** @type {(string | symbol)[]} */
    // @ts-ignore
    currentData = map.get(currentWord) ?? [];

    // @ts-ignore
    if (shouldStopASAP && currentData.includes(SYMBOL_END)) currentData = null;
    else
      currentWord = currentData[Math.floor(Math.random() * currentData.length)];

    if (currentWord === SYMBOL_END) {
      currentWord = undefined;
    }
  }

  while (currentWord) {
    sentence.push(currentWord);

    if (sentence.length >= MAX_LENGTH) {
      shouldStopASAP = true;
      break;
    }

    updateCurrentData();
  }

  return sentence.join(" ");
}

/**
 * Generate a sentence from a list of sentences, which will be consumed to generate a
 * markov chain.
 *
 * @param {Array<string>} array Chain data.
 * @param {GenerateOptions} [options] Options to influence how data is generated.
 */
export async function generateFrom(array, options = {}) {
  return generate(await loadArray(array), options);
}

// /**
//  * @param {Record<string | symbol, number>} data
//  */
// function generateKeyArray(data) {
//   let length,
//     i = 0;

//   if (debug) {
//     console.log(
//       ":: generate -> get key array",
//       ": data size",
//       (length = Reflect.ownKeys(data).length)
//     );
//   }

//   let arr = [];

//   for (let K of Reflect.ownKeys(data)) {
//     const V = data[K];

//     if (debug) {
//       i++;

//       console.log(
//         ":: generate -> get key array",
//         i,
//         "out of",
//         length,
//         ":",
//         K,
//         "times",
//         V
//       );
//     }

//     // @ts-ignore
//     if (K === SYMBOL_END) K = null;

//     arr = arr.concat(Array(V).fill(K));
//   }

//   return arr;
// }

function getKeyArray(map, key) {
  return map.get(key);
}

/**
 * @typedef {object} GenerateOptions
 * @property {string} [start]
 */
