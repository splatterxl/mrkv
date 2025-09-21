export class Corpus {
    /**
     * Load an array of sentences into a new corpus.
     * @param {string[]} sentences
     * @returns {Corpus}
     */
    static fromArray(sentences: string[]): Corpus;
    /**
     * Create a new corpus and immediately load a string
     * @param {string} text
     * @returns {Corpus}
     */
    static from(text: string): Corpus;
    /**
     * Create a new corpus
     * @param {number} [stateLength=2] Amount of previous words to consider for the next word.
     * @param {string|RegExp} [splitter] The character(s) used to separate sentences, i.e. to terminate the generation.
     * @param {function(string): boolean} [filter] A filter function to apply to each sentence
     * @param {function(string): string} [replace] A function to modify each sentence before processing
     * @param {string} [extraChar] An extra character to append to each sentence if it doesn't already end with it (e.g. a period).
     */
    constructor(stateLength?: number, splitter?: string | RegExp, filter?: (arg0: string) => boolean, replace?: (arg0: string) => string, extraChar?: string);
    get size(): number;
    private stateLength: number;
    private terminator: RegExp;
    private filter: (arg0: string) => boolean;
    private replace: (arg0: string) => string;
    private extraChar: string;
    /**
     * Load an array of sentences into the corpus asynchronously.
     * @param {string[]} sentences
     * @returns {Promise<void>}
     */
    loadAsync(sentences: string[]): Promise<void>;
    /**
     * Load text into the corpus.
     * @param {string[]|string} text
     */
    load(text: string[] | string): void;
    /**
     * Generate a sentence from the corpus.
     * @param {string|symbol} [start=kStart] The starting word or phrase. Use the special symbol `Corpus.kStart` to start from the beginning.
     * @param {number} [maxLength=Infinity] The maximum length of the generated sentence.
     * @param {string|RegExp} [terminator] An optional terminator to stop generation when encountered.
     * @returns {string} The generated sentence.
     */
    generate(start?: string | symbol, maxLength?: number, terminator?: string | RegExp): string;
    toJSON(): {
        stateLength: number;
        terminator: string;
        extraChar: string;
        data: {};
    };
    #private;
}
