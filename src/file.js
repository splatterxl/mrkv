import fs from "node:fs";
import os from "node:os";
import loadArray from "./load.js";
import generate from "./generate.js";

/**
  * Identical to {@link loadArray} in operation, loads a newline-delimited
  * list of sentences from a file.
  *
  * @param {string} name File to read from.
  */
export function loadFile(name) {
  const file = fs.readFileSync(name, 'utf-8');

  const arr = file.split(os.EOL);

  return loadArray(arr);
}

/**
  * Generate a sentence from a file of newline-delimited sentences. Identical
  * in operation to {@link generate}.
  *
  * @param {string} name
  * @param {import("./generate.js").GenerateOptions} options
  */
export function generateFile(name, options = {}) {
  const map = loadFile(name);

  return generate(map, options);
}
