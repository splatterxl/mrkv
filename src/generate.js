import loadArray, { SYMBOL_END, SYMBOL_START } from "./load.js";

const MAX_LENGTH = 40;

/**
 * Generate a sentence based on the markov chain data provided.
 *
 * @param {Map<string | symbol, (string | symbol)[]>} map Markov chain data
 * @param [options] Options to influence how data is generated.
 */
export default function generate(map, options = {}) {
  let shouldStopASAP = false;

  if (
    (options.start != undefined && typeof options.start !== "string") ||
    (options.limit != undefined && typeof options.limit !== "number")
  ) {
    throw new TypeError("Invalid input to generation options");
  }

  let startArray = options.start?.split(" ") ?? [];

  /**
   * @type {symbol | string | undefined}
   */
  let currentWord = startArray[startArray.length - 1] ?? SYMBOL_START;
  let currentData;
  if (currentWord === SYMBOL_START) updateCurrentData();

  const sentence = startArray.slice(0, -1) ?? [];

  function updateCurrentData() {
    /** @type {(string | symbol)[]} */
    // @ts-ignore
    currentData = map.get?.(currentWord) ?? [];

    // @ts-ignore
    if (shouldStopASAP && currentData.includes(SYMBOL_END)) currentData = null;
    else
      currentWord =
        // @ts-ignore
        currentData[Math.floor(Math.random() * currentData.length)];

    if (currentWord === SYMBOL_END) {
      currentWord = undefined;
    }
  }

  while (currentWord) {
    sentence.push(currentWord);

    if (sentence.length >= (options.length ?? MAX_LENGTH)) {
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
 * @param [options] Options to influence how data is generated.
 */
export async function generateFrom(array, options = {}) {
  return generate(await loadArray(array), options);
}
