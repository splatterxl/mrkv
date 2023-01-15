import swc from "rollup-plugin-swc3";

/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
  input: "src/index.js",
  output: {
    name: "mrkv",
    file: "index.js",
    format: "esm",
    compact: false,
  },
  plugins: [
    swc({
      jsc: {
        parser: {
          syntax: "typescript",
        },
        target: "es2022",
      },
      minify: false,
    }),
  ],
};

export default config;
