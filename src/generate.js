import loadArray, { SYMBOL_END, SYMBOL_START } from "./load.js";

/**
  * Generate a sentence based on the markov chain data provided.
  *
  * @param {Map<string | symbol, Record<string | symbol, number>} map Chain data.
  * @param {GenerateOptions} [options] Options to influence how data is generated.
  */
export default function generate(map, options = {}) {
  let currentWord = SYMBOL_START;
  let currentData;
  updateCurrentData();

  const sentence = [];

  function updateCurrentData() {
    currentData = getKeyArray(map, currentWord);
    currentWord = currentData[Math.floor(Math.random() * currentData.length)];
  }

  while (currentWord) {
    sentence.push(currentWord);
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
export function generateFrom(array, options = {}) {
  return generate(loadArray(array), options);
}

/**
  * @param {Record<string | symbol, number>} data
  */
function generateKeyArray(data) {
  let arr = [];

  for (let K of Reflect.ownKeys(data)) {
    const V = data[K];

    if (K === SYMBOL_END) K = null;

    arr = arr.concat(Array(V).fill(K));
  }

  return arr;
}

function getKeyArray(map, key) {
  return generateKeyArray(map.get(key));
}

/**
  * @typedef {object} GenerateOptions
  */
