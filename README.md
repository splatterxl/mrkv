# mrkv

A simple, fast and lightweight (zero dependencies) Markov chain library for use in browser and backend JavaScript environments. It uses the latest conventions and the Promises API to speed up computing, and provides simple utilities to read from files for Node.js environments too.

Useful for creating silly texts from a pattern of sentences, e.g. exported from a chat platform!

## Usage

- Loading an array

  ```js
  const map = await loadArray(["i like hamburgers", "i like cats"]);
  ```

- Loading a file (newline-seperated sentences)

  ```js
  const map = await loadFile("data.txt");
  ```

- Generating a sentence

  ```js
  generateFromMap(map); // i like hamburgers or i like cats
  ```

- Completing a sentence

  ```js
  generateFromMap(map, {
    start: "i like",
  });

  // -> i like hamburgers or i like cats
  ```

## Installation

From npm:

```sh
npm install mrkv
yarn add mrkv
```

## Documentation

### `loadArray(sentences: string): Promise<Corpus>`

Takes an array of sentences and returns a data map representing the consumed sentences' patterns. This data structure is designed to maximise speed over RAM usage, so in some cases (>500k sentences) it can be very resource intensive to generate and store the result of this function.

```js
const map = await loadArray([
  "i like apples",
  "apples are my favourite fruit",
  "i like fruit but chocolate bars are better",
]);

console.log(generateFromMap(map));
```

[More information about `generateFromMap`](#generatefrommapcorpus-corpus-string)

### `loadFile(name: string): Promise<Corpus>`

**Node.js only**

Reads a file, then uses [`loadArray`](#loadarraysentences-string-promisecorpus) to generate a data map and return the resulting value. The same caveat, although possibly worse, applies from `loadArray`, given that you have to first read a large file, store that result and _then_ generate a data structure for the chain.

```py
# data.txt
i like apples
apples are my favourite fruit
i like fruit but chocolate bars are better
```

```js
const map = await loadFile("data.txt");

console.log(generateFromMap(map));
```

### `generateFromMap(corpus: Corpus, options?): string`

Generate a string value from the data structure. This function has seen many underlying logic iterations and is now optimised for speed _and_ RAM usage. Make sure to call this every time you want a value from the map instead of generating a new map every time!

```js
const map = await loadArray([
  "i like apples",
  "apples are my favourite fruit",
  "i like fruit but chocolate bars are objectively better",
  "chocolate bars are delicious",
]);

console.log(generateFromMap(map));

// the result could be different, e.g. "apples are objectively better" or
// "chocolate bars are my favourite fruit", etc.

// the options control the sentence's start
generateFromMap(map, {
  start: "i like",
});
```

### `generateFromArray(array: Array<string>, options?): Promise<string>`

Generates a string value from the array of sentences, calling [`loadArray`](#loadarraysentences-string-promisecorpus) and then [`generateFromMap`](#generatefrommapcorpus-corpus-string). If you need to generate a string more than once from a specific sentence array, **do not use this method**. Instead, follow the example explained in both of the linked functions.

```js
console.log(
  await generateFromArray([
    "i like apples",
    "apples are my favourite fruit",
    "i like fruit but chocolate bars are objectively better",
    "chocolate bars are delicious",
  ])
);
```

### `generateFile(name: string, options?): Promise<string>`

**Node.js only**

This method should only be used in exceptional circumstances or in scripting. This is a once-off function, if you need to reuse the file **do not do it this way**. Refer to [`generateFromMap`](#generatefrommapcorpus-corpus-string).

Calls [`loadFile`](#loadfilename-string-promisecorpus) and then `generateFromMap` to simplify one-time operations.

```py
# data.txt
i like apples
apples are delicious
i like fruit but chocolate bars are better
chocolate bars are unhealthy.
```

```js
console.log(await generateFile("data.txt"));
// e.g. chocolate bars are delicious
```

## Features

| Feature              | mrkv | [kurwov](https://github.com/xiboon/kurwov) | markov-typescript | markov-generator | markov-strings | markov-chains |
| -------------------- | ---- | ------------------------------------------ | ----------------- | ---------------- | -------------- | ------------- |
| Dependency-free      | ✔️   | ✔️                                         | ❌                | ✔️               | ❌             | ❌            |
| Typings              | ✔️   | ✔️                                         | ❌                | ❌               | ✔️             | ❌            |
| Generating sentences | ✔️   | ✔️                                         | ✔️                | ✔️               | ✔️             | ✔️            |
| Completing sentences | ✔️   | ✔️                                         | ❌                | ❌               | ❌             | ❌            |

## Buy me a coffee

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/K3K6AOLXV)
