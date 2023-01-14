import swc from "rollup-plugin-swc3";

/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
  input: "src/node.js",
  output: {
    name: "mrkv",
    file: "build/cjs.js",
    format: "cjs",
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
