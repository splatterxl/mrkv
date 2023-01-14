export const SYMBOL_END = Symbol("kEnd");
export const SYMBOL_START = Symbol("kStart");

export default async function loadArray(sentences) {
  /**
   * @type {Map<string | symbol, Array<string>>}
   */
  const map = new Map();

  function addWord(word, next) {
    next ??= SYMBOL_END;

    const already = map.get(word);

    if (!already) {
      return map.set(word, [next]);
    } else {
      already.push(next);

      map.set(word, already);
    }
  }

  await Promise.all(
    sentences.map(async (sentence) => {
      const words = sentence.split(/ +/g).filter((v) => v.length);

      if (!words.length) return;

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
    })
  );

  return map;
}
