import swc from "rollup-plugin-swc3";

/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
  input: "src/index.js",
  output: {
    name: "mrkv",
    file: "build/web.js",
    format: "iife",
    compact: true,
  },
  plugins: [
    swc({
      jsc: {
        parser: {
          syntax: "typescript",
        },
        target: "es2022",
      },
      minify: true,
    }),
  ],
};

export default config;
