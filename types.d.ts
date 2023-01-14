declare module "mrkv" {
  declare interface GenerateOptions {
    start?: string;
  }

  /**
   * Data loaded from a sentence array based on the probability of meeting the next string.
   */
  declare type Corpus = Map<string | symbol, (string | symbol)[]>;

  /**
   * Generate a similar sentence from a list of sentences, which will be consumed to generate a
   * markov chain.
   *
   * @param [options] Options to influence how data is generated.
   */
  export async function generateFromArray(
    array: string[],
    options?: GenerateOptions
  ): Promise<string>;

  /**
   * Generate a sentence based on the {@link Corpus} provided.
   *
   * @param [options] Options to influence how data is generated.
   */
  export function generateFromMap(
    map: Corpus,
    options?: GenerateOptions
  ): string;

  /**
   * Take an array of sentences and return a {@link Corpus}
   * representing the consumed sentences' patterns.
   */
  export default async function loadArray(sentences: string[]): Promise<Corpus>;

  /**
   * Identical to {@link loadArray} in operation, loads a newline-delimited
   * list of sentences from a file.
   *
   * @param name File to read from.
   */
  function loadFile(name: string): Promise<Corpus>;

  /**
   * Generate a sentence from a file of newline-delimited sentences. Identical
   * in operation to {@link generateFromMap}.
   *
   * @param name File to read from.
   */
  function generateFile(name: string, options?: {}): Promise<string>;
}
