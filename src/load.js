export const SYMBOL_END = Symbol("kEnd");
export const SYMBOL_START = Symbol("kStart");

/**
 * Take an array of sentences and return a Map<string, Record<string | symbol, number>>
 * * representing word order of the sentences.
 *
 * @param {Array<string>} sentences
 */
export default function loadArray(sentences) {
  /**
   * @type {Map<string | symbol, Record<string | symbol, number>>}
   */
  const map = new Map();

  function addWord(word, next) {
    next ??= SYMBOL_END;

    const already = map.get(word);

    if (!already) {
      return map.set(word, { [next]: 1 });
    } else {
      let freq = already[next];

      if (!freq) freq = 1;
      else freq += 1;

      already[next] = freq;
      map.set(word, already);
    }
  }

  for (const sentence of sentences) {
    const words = sentence.split(/ +/g).filter((v) => v.length);

    if (!words.length) continue;

    for (let i = 0; i < words.length; i++) {
      const word = words[i];

      if (i === 0 && word.length) {
        addWord(SYMBOL_START, word);
      }

      if (i + 1 === words.length) {
        addWord(word, undefined);
        continue;
      }

      const next = words[i + 1];

      addWord(word, next);
    }
  }

  return map;
}
