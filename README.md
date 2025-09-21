# mrkv

A simple, fast and lightweight (zero dependencies) Markov chain library for use in browser and backend JavaScript environments. It uses the latest conventions and the Promises API to speed up computing, and provides simple utilities to read from files for Node.js environments too.

Useful for creating silly texts from a pattern of sentences, e.g. exported from a chat platform!

### Optimisations in v2

- Loading a new dataset is **~32x faster**
- Generation is significantly more memory efficient especially across repetitive datasets
- More predictable performance, scalability

| Version        | Load (10k)        | Generation (10k) | Load (100k)     | Generation (100k) |
| -------------- | ----------------- | ---------------- | --------------- | ----------------- |
| Original impl. | 37.6 ops/sec      | 570k ops/sec     | 2.94 ops/sec    | 209k ops/sec      |
| **Current**    | **1,208 ops/sec** | **331k ops/sec** | **111 ops/sec** | **162k ops/sec**  |

> Slightly slower generation, but significantly more memory efficient and scalable.

## Usage

```js
const corpus = new Corpus();

corpus.load(readFileSync("./bible.txt", "utf-8"));

corpus.generate();
```

## Installation

From npm:

```sh
pnpm install mrkv
```

## Features

| Feature              | mrkv | [kurwov](https://github.com/xiboon/kurwov) | markov-typescript | markov-generator | markov-strings | markov-chains |
| -------------------- | ---- | ------------------------------------------ | ----------------- | ---------------- | -------------- | ------------- |
| Dependency-free      | ✔️   | ✔️                                         | ❌                | ✔️               | ❌             | ❌            |
| Typings              | ✔️   | ✔️                                         | ❌                | ❌               | ✔️             | ❌            |
| Generating sentences | ✔️   | ✔️                                         | ✔️                | ✔️               | ✔️             | ✔️            |
| Completing sentences | ✔️   | ✔️                                         | ❌                | ❌               | ❌             | ❌            |

## Benchmarks

Benchmarks ran on Apple M2 chip, 16GB RAM.

```
mrkv 10k load x 1,208 ops/sec ±5.09% (85 runs sampled)
mrkv 10k gen x 330,612 ops/sec ±0.58% (93 runs sampled)
mrkv 100k load x 111 ops/sec ±1.75% (60 runs sampled)
mrkv 100k gen x 162,437 ops/sec ±3.18% (91 runs sampled)
```

## Buy me a coffee

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/K3K6AOLXV)
