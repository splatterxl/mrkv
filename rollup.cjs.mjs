import swc from "rollup-plugin-swc3";

/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
  input: "src/node.js",
  output: {
    name: "mrkv",
    file: "node.js",
    format: "cjs",
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
