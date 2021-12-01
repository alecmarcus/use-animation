import babel from "rollup-plugin-babel";
import cleanup from "rollup-plugin-cleanup";
import external from "rollup-plugin-peer-deps-external";
import { terser } from "rollup-plugin-terser";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

const isProd = process.env.NODE_ENV === "production";
const prodPlugins = [
  cleanup(),
  terser({
    mangle: {
      keep_fnames: true,
    },
    compress: {
      module: false,
    },
  }),
];

const outputs = [
  {
    esModule: false,
    format: "cjs",
    name: "main",
  },
  {
    esModule: true,
    format: "esm",
    name: "module",
  },
];

export default {
  input: "src/index.ts",
  plugins: [
    babel({
      exclude: /node_modules/,
    }),
    external(),
    typescript(),
    ...(isProd ? prodPlugins : []),
  ],
  output: outputs.map(({ esModule, name, format }) => ({
    format,
    esModule,
    entryFileNames: "[name].js",
    dir: pkg[name],
    sourcemap: !isProd,
  })),
};
