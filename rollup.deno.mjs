import swc from "rollup-plugin-swc3";
import deno from "rollup-plugin-deno";

/**
 * @type {import("rollup").RollupOptions}
 */
const config = {
  input: "src/node.js",
  output: {
    name: "mrkv",
    file: "mod.ts",
    format: "esm",
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
    // @ts-ignore
    deno(),
  ],
};

export default config;
