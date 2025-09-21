const kStart = Symbol("start");
const kEnd = Symbol("end");
const kError = Symbol("error");

export class Corpus {
  /** @type {Map<string | symbol, {total:number, cumulative: [key: string, count: number][]}>} */
  #tokens = new Map();

  get size() {
    return this.#tokens.size;
  }

  /**
   * Load an array of sentences into a new corpus.
   * @param {string[]} sentences
   * @returns {Corpus}
   */
  static fromArray(sentences) {
    const corpus = new Corpus();
    corpus.load(sentences);
    return corpus;
  }

  /**
   * Create a new corpus and immediately load a string
   * @param {string} text
   * @returns {Corpus}
   */
  static from(text) {
    const corpus = new Corpus();
    corpus.load(text);
    return corpus;
  }

  /**
   * Create a new corpus
   * @param {number} [stateLength=2] Amount of previous words to consider for the next word.
   * @param {string|RegExp} [splitter] The character(s) used to separate sentences, i.e. to terminate the generation.
   * @param {function(string): boolean} [filter] A filter function to apply to each sentence
   * @param {function(string): string} [replace] A function to modify each sentence before processing
   * @param {string} [extraChar] An extra character to append to each sentence if it doesn't already end with it (e.g. a period).
   */
  constructor(
    stateLength = 2,
    splitter = /\.\s+/,
    filter = () => true,
    replace = (sentence) => sentence,
    extraChar = ".",
  ) {
    this.stateLength = stateLength;
    this.terminator = new RegExp(splitter);
    this.filter = filter;
    this.replace = replace;
    this.extraChar = extraChar;
  }

  /**
   * Load an array of sentences into the corpus asynchronously.
   * @param {string[]} sentences
   * @returns {Promise<void>}
   */
  async loadAsync(sentences) {
    return this.load(sentences);
  }

  /**
   * Load text into the corpus.
   * @param {string[]|string} text
   */
  load(text) {
    const sentences = (
      Array.isArray(text) ? text : text.trim().split(this.terminator)
    ).map((s) =>
      this.extraChar
        ? s.endsWith(this.extraChar)
          ? s
          : s + this.extraChar
        : s,
    );

    const data = new Map();

    for (let sentence of sentences) {
      if (!sentence || !this.filter(sentence)) continue;
      if (this.replace) sentence = this.replace(sentence);
      sentence = sentence.trim();

      const words = sentence.split(/\s+/);

      if (words.length <= this.stateLength) continue;

      /** @type {(string|symbol)[]} */
      let currentWords = words.splice(0, this.stateLength);

      // add to start
      data.get(kStart)?.set(currentWords.join(" "), 1) ||
        data.set(kStart, new Map([[currentWords.join(" "), 1]]));

      while (words.length) {
        const key = currentWords.join(" ");
        const selected = words.shift();
        if (!selected) break;

        if (currentWords.length < this.stateLength) {
          currentWords.push(selected);
          continue;
        }

        const nextWords = data.get(key);

        if (nextWords) {
          const count = nextWords.get(selected) || 0;
          nextWords.set(selected, count + 1);
        } else {
          data.set(key, new Map([[selected, 1]]));
        }

        currentWords.shift();
        currentWords.push(selected);
      }

      const key = currentWords.join(" ");
      data.get(key)?.set(kEnd, 1) || data.set(key, new Map([[kEnd, 1]]));
    }

    for (const [key, nextWords] of data.entries()) {
      // merge with existing data
      const existing = this.#tokens.get(key);

      if (existing) {
        for (const [word, count] of nextWords.entries()) {
          const existingCount = existing.cumulative.find(
            ([w]) => w === word,
          )?.[1];
          if (existingCount) {
            existing.cumulative = existing.cumulative.map(([w, c]) =>
              w === word ? [w, c + count] : [w, c],
            );
            existing.total += count;
          } else {
            existing.cumulative.push([word, count]);
            existing.total += count;
          }
        }
        // re-sort cumulative
        existing.cumulative.sort((a, b) => a[0].localeCompare(b[0]));
      } else {
        const cumulative = [];
        let total = 0;
        for (const [word, count] of nextWords.entries()) {
          cumulative.push([word, count]);
          total += count;
        }
        // cumulative.sort((a, b) => a[0].localeCompare(b[0]));
        // @ts-ignore
        this.#tokens.set(key, { total, cumulative });
      }
    }
  }

  /**
   * Generate a sentence from the corpus.
   * @param {string|symbol} [start=kStart] The starting word or phrase. Use the special symbol `Corpus.kStart` to start from the beginning.
   * @param {number} [maxLength=Infinity] The maximum length of the generated sentence.
   * @param {string|RegExp} [terminator] An optional terminator to stop generation when encountered.
   * @returns {string} The generated sentence.
   */
  generate(start = kStart, maxLength = Infinity, terminator = /\.\s*?$/) {
    const result = [];
    /** @type {string|symbol} */
    let currentKey = start;
    terminator =
      typeof terminator === "string"
        ? new RegExp(terminator + "$")
        : terminator;

    for (let i = 0; i < maxLength; i++) {
      const token = this.#tokens.get(currentKey);
      if (!token) {
        break;
      }

      let rand = Math.random() * token.total;

      /** @type {string|symbol} */
      let selectedWord = kError;
      let curr = 0;
      for (const [word, count] of token.cumulative) {
        if (rand <= curr + count) {
          selectedWord = word;
          break;
        }
        curr += count;
      }

      if (selectedWord === kEnd || typeof selectedWord === "symbol") {
        break;
      }

      result.push(selectedWord);
      const currentWords =
        typeof currentKey === "symbol" ? [] : currentKey.split(" ");
      currentWords.push(selectedWord);
      if (currentWords.length > this.stateLength) {
        currentWords.shift();
      }
      currentKey = currentWords.join(" ");

      if (typeof selectedWord === "string" && terminator.test(selectedWord)) {
        break;
      }
    }

    return result.join(" ");
  }

  toJSON() {
    const obj = {};
    for (const [key, { total, cumulative }] of this.#tokens.entries()) {
      obj[key.toString()] = { total, cumulative };
    }
    return {
      stateLength: this.stateLength,
      terminator: this.terminator.toString(),
      extraChar: this.extraChar,
      data: obj,
    };
  }
}
