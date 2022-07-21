import fs from "node:fs";
import os from "node:os";
import generate from "./generate.js";
import loadArray from "./load.js";

const debug = true;

/**
 * Identical to {@link loadArray} in operation, loads a newline-delimited
 * list of sentences from a file.
 *
 * @param {string} name File to read from.
 */
export function loadFile(name) {
  if (debug) {
    process.stdout.write(":: read file " + name);
  }

  const file = fs.readFileSync(name, "utf-8");

  if (debug) {
    process.stdout.write(" byte size " + Buffer.byteLength(file));
  }

  const arr = file.split(os.EOL);

  if (debug) {
    process.stdout.write(" -> success, arr len " + arr.length + "\n");
  }

  return loadArray(arr);
}

/**
 * Generate a sentence from a file of newline-delimited sentences. Identical
 * in operation to {@link generate}.
 *
 * @param {string} name
 * @param {import("./generate.js").GenerateOptions} options
 */
export async function generateFile(name, options = {}) {
  const map = await loadFile(name);

  if (debug) console.debug(":: generate file", name, "map size", map.size);

  return generate(map, options);
}
